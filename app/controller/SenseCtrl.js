/**
 * Created by ivar on 23.11.15.
 */

define([
	'angularAMD',
	'angular-animate',
	'service/DirtyStateService',
	'service/ConfirmModalService',
	'service/AnchorService',
	'service/LexiconService',
	'service/SenseRelTypeService',
	'service/SenseService',
	'service/SenseStyleService',
	'service/ExtRelTypeService',
	'service/ExtSystemService'
], function(angularAMD) {

	angularAMD.controller('SenseCtrl', [
		'$scope',
		'$rootScope',
		'$state',
		'$stateParams',
		'$q',
		'$log',
		'$uibModal',
		'wnwbApi',
		'$animate',
		'service/DirtyStateService',
		'service/ConfirmModalService',
		'service/AnchorService',
		'service/LexiconService',
		'service/SenseRelTypeService',
		'service/SenseService',
		'service/SenseStyleService',
		'service/ExtRelTypeService',
		'service/ExtSystemService',
		'relTypes',
		'senseStyles',
        'spinnerService',
		'extRelTypes',
		'extSystems',
		function(
			$scope,
			$rootScope,
			$state,
			$stateParams,
			$q,
			$log,
			$uibModal,
			wnwbApi,
			$animate,
			dirtyStateService,
			confirmModalService,
			anchorService,
			lexiconService,
			relTypeService,
			senseService,
			senseStyleService,
			extRelTypeService,
			extSystemService,
			relTypes,
			senseStyles,
            spinnerService,
			extRelTypes,
			extSystems
		) {
			$scope.baseState = $scope.state;

			var senseDeferred = $q.defer();
			var sensePromise = senseDeferred.promise;

			var senseId = 0;
			if ($stateParams.senseId) {
				senseId = $stateParams.senseId;
			}

			$scope.relTypes = relTypes;
			$scope.extRelTypes = extRelTypes;
			$scope.extSystems = extSystems;
			$scope.senseStyles = senseStyles;

			$scope.sense = {};
			$scope.currentSense = $scope.sense;
			$scope.originalSense = {};
			if ($stateParams.senseObj) {
				$scope.sense = $stateParams.senseObj;
				$scope.currentSense = $scope.sense;
				angular.copy($scope.sense, $scope.originalSense);
			}
			$scope.fIsDirty = false;

            //for lex-usage directive
            $scope.searchLemma = '';
            $scope.setSearchLemma = function(lemma) {
                if ($scope.searchLemma == lemma) {
                    lemma = lemma + ' ';
                }
                $scope.searchLemma = lemma;
            };

			////////////////////////////
			// Sense definition methods
			////////////////////////////

			$scope.selectedDefinition = null;
			$scope.tempDef = {};

			$scope.selectSenseDefinitionForView = function(def) {
				$scope.selectedDefinition = def;
				if ($scope.selectedDefinition) {
					$state.go('.', {}, {
						relative : $scope.baseState
					}).then(function() {
						$state.go('.def', {
							defId : $scope.selectedDefinition.id
						}, {
							relative : $scope.baseState
						}).then(function() {});
					});
				}
			};

			$scope.selectSenseDefinitionForEdit = function(def) {
				$scope.selectedDefinition = def;
				if ($scope.selectedDefinition) {
					$state.go('.', {}, {
						relative : $scope.baseState
					}).then(function() {
						$state.go('.def_edit', {
							defId : $scope.selectedDefinition.id
						}, {
							relative : $scope.baseState
						}).then(function() {});
					});
				}
			};

			$scope.getDefinition = function(definitionId) {
				$log.log('controller/SenseCtrl.getDefinition');
				var deferred = $q.defer();

				if (definitionId) {
					sensePromise.then(function(sense) {
						$log.log('get sense definition');
						var fFound = false;
						for (k in sense.sense_definitions) {
							if (sense.sense_definitions[k].id == definitionId) {
								$scope.selectedDefinition = sense.sense_definitions[k];
								deferred.resolve(sense.sense_definitions[k]);
								fFound = true;
								break;
							}
						}
						if (!fFound) {
							deferred.reject('not found');
						}
					});
				} else {
					if ($scope.selectedDefinition) {
						$log.log('get selected definition');
						deferred.resolve($scope.selectedDefinition);
					} else {
						$log.log('get empty definition');
						deferred.resolve({
							statements : [],
							language : $scope.language
						});
					}
				}

				return deferred.promise;
			};

			$scope.addSenseDefinition = function() {
				$scope.selectedDefinition = null;
				$state.go('lexicon.synset_edit.sense_edit.def_edit');
			};

			$scope.deleteSenseDefinition = function(definition) {
				var index = $scope.currentSense.sense_definitions.indexOf(definition);
				if (index > -1) {
					$scope.currentSense.sense_definitions.splice(index, 1);
					if (length($scope.currentSense.sense_definitions) == 0) {
						$scope.currentSense.primary_definition = '';
					}
				}
			};

			$scope.discardSenseDefinition = function() {
				$state.go('lexicon.synset_edit.sense_edit');
			};

			$scope.closeDefinition = function() {
				$state.go('lexicon.synset.sense');
			};

			$scope.setPrimarySenseDefinition = function(value) {
				for (var i = 0; i < $scope.currentSense.sense_definitions.length; i++) {
					$scope.currentSense.sense_definitions[i].is_primary = false;
				}
				value.is_primary = true;
				$scope.currentSense.primary_definition = value.text;
			};

			$scope.saveDefinition = function(def, origDef) {
				console.log('save sense definition');
				var isSame = false;
				if ($scope.currentSense.primary_definition) {
					isSame = $scope.currentSense.primary_definition.length == 0;
				} else {
					isSame = true;
				}
				if (!isSame && $scope.selectedDefinition) {
					isSame = isSame || $scope.selectedDefinition.text === $scope.currentSense.primary_definition;
				}
				if (def.id) {
					angular.copy(def, $scope.selectedDefinition);
				} else {
					if (origDef == $scope.selectedDefinition) {
						angular.copy(def, $scope.selectedDefinition);
					} else {
						$scope.currentSense.sense_definitions.push(angular.copy(def));
					}
				}
				if (isSame) {
					$scope.currentSense.primary_definition = def.text;
				}
			};

			/////////////////////////
			// Sense example methods
			/////////////////////////

			$scope.tempExample = {};
			$scope.selectedExample = null;

			$scope.addExample = function() {
				var newExample = {
					text : '',
					language : $scope.language,
					source : ''
				};
				$scope.sense.examples.push(newExample);
				$scope.selectedExample = newExample;
				$scope.tempExample = angular.copy(newExample);
			};

			$scope.editExample = function(example) {
				if ($scope.selectedExample) {
					$scope.saveExample();
					$scope.cancelExample();
				}
				$scope.tempExample = angular.copy(example);
				$scope.tempExample.language = $scope.languageCodeMap[$scope.tempExample.language];
				$scope.selectedExample = example;
			};

			$scope.setPrimaryExample = function(value) {
				for (var i = 0; i < $scope.currentSense.examples.length; i++) {
					$scope.currentSense.examples[i].is_primary = false;
				}
				value.is_primary = true;
				$scope.currentSense.primary_example = value.text;
			};

			$scope.validateExample = function(example) {
				$scope.exampleErrors = {};
				var fIsValid = true;
				if (!example.language || !$scope.languageCodeMap[example.language]) {
					$scope.exampleErrors.language = {
						invalid : true
					};
					fIsValid = false;
				}
				if (!example.text || !example.text.length) {
					$scope.exampleErrors.text = {
						required : true
					};
					fIsValid = false;
				}
				return fIsValid;
			};

			$scope.saveExample = function() {
				var tempExample = angular.copy($scope.tempExample);
				if (tempExample.language.code) {
					tempExample.language = tempExample.language.code;
				} else {
					tempExample.language = null;
				}
				if ($scope.validateExample(tempExample)) {
					var isSame = false;
					if ($scope.currentSense.primary_example) {
						isSame = $scope.selectedExample.text === $scope.currentSense.primary_example || $scope.currentSense.primary_example.length == 0;
					} else {
						isSame = true;
					}
					angular.copy(tempExample, $scope.selectedExample);
					if (isSame) {
						$scope.currentSense.primary_example = $scope.selectedExample.text;
					}
					$scope.cancelExample();
				}
			};

			$scope.cancelExample = function() {
				if (!$scope.validateExample($scope.selectedExample)) {
					$scope.deleteExample($scope.selectedExample);
				}
				$scope.selectedExample = null;
			};

			$scope.deleteExample = function(example) {
				var index = $scope.currentSense.examples.indexOf(example);
				if (index > -1) {
					$scope.currentSense.examples.splice(index, 1);
					if (length($scope.currentSense.examples) == 0) {
						$scope.currentSense.primary_example = '';
					}
				}
			};

			//////////////////////////
			// Sense relation methods
			//////////////////////////

			// Populates relation tree view
			$scope.$watchCollection('sense.relations', function(newValue, oldValue) {
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

					var relationsGrouped = _.groupBy($scope.sense.relations, function(item) {
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
							if (relationsGrouped[k][k2].a_sense == $scope.sense.id) {
								obj.name = relationsGrouped[k][k2].b_label;
								nodes_out.push(obj);
							}
							if (relationsGrouped[k][k2].b_sense == $scope.sense.id) {
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
						$state.go('lexicon.sense.rel', {
							relId : relation.id
						});
					} else {
						$state.go('lexicon.sense').then(function() {
							$state.go('lexicon.sense.rel', {
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
						$state.go('lexicon.sense_edit.rel_edit', {
							relId : relation.id
						});
					} else {
						$state.go('lexicon.sense_edit').then(function() {
							$state.go('lexicon.sense_edit.rel_edit', {
								relId : null
							}).then(function() {});
						});
					}
				}
			};

			$scope.getRelation = function(relId) {
				var deferred = $q.defer();

				if (relId) {
					sensePromise.then(function(sense) {
						var fFound = false;
						for (k in sense.relations) {
							if (sense.relations[k].id == relId) {
								$scope.selectedRel = sense.relations[k];
								deferred.resolve(sense.relations[k]);
								fFound = true;
								break;
							}
						}
						if (!fFound) {
							deferred.reject('not found');
						}

					// deferred.resolve(null);
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

				sensePromise.then(function(sense) {
					$log.log('relation list resolve');
					deferred.resolve($scope.sense.relations);
				});

				return deferred.promise;
			};

			// Used by RelCtrl to remove existing relations
			$scope.clearRel = function(relId) {
				senseService.clearRelation($scope.sense, relId);
			};

			// Used by RelCtrl to create relations
			$scope.setRel = function(source, target, relTypeId) {
				senseService.setRelation($scope.sense, source, target, relTypeId);
			};

			$scope.addRel = function(relType, relDir) {
				$scope.selectedRel = null;
				if (relType) {
					$state.go('.rel_edit', {
						relId : null,
						relTypeId : relType.id,
						relDir : relDir
					}, {
						relative : $scope.baseState
					});
				} else {
					$state.go('.rel_edit', {
						relId : null
					}, {
						relative : $scope.baseState
					});
				}
			};

			$scope.discardRel = function() {
				$state.go('^');
			};

			$scope.saveRel = function(rel, selectedRelType, counterRelType, targetSense) {
				$state.go('^');
			};

			$scope.deleteRel = function(relation) {
				if (relation) {
					senseService.clearRelation($scope.sense, relation.id);
				}
			};



			////////////////////////
			// External ref methods
			////////////////////////

			$scope.tempExtRef = {}; // parasjagu käsitletav andmestik
			$scope.selectedExtRef = null; // viit listist väljavalitud andmestikule

			$scope.addExtRef = function() {
				var newExtRef = {
					system : '',
					sys_id : {},
					reference : '',
					type_ref_code : '',
					rel_type : {}
				};
				$scope.sense.sense_externals.push(newExtRef);
				$scope.selectedExtRef = newExtRef;
				$scope.tempExtRef = angular.copy(newExtRef);
			};

			$scope.editExtRef = function(extRef) {
				if ($scope.selectedExtRef) {
					$scope.saveExtRef();
				}
				$scope.selectedExtRef = extRef;
				$scope.tempExtRef = angular.copy(extRef);
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
				var index = $scope.sense.sense_externals.indexOf(extRef);
				if (index > -1) {
					$scope.sense.sense_externals.splice(index, 1);
				}
			};

			$scope.setExtRefKey = function(extRef) {
				return $uibModal.open({
					templateUrl : 'view/main/literalSerachModal.html',
					scope : $scope,
					controller : 'main/literalSearchCtrl',
					resolve : {
						searchType : function() {
							return 'sense';
						},
						lexiconMode : function() {
							if ($scope.tempExtRef.sys_id.local_lexicon === null) return 'any'; else return $scope.tempExtRef.sys_id.local_lexicon;
						}
                        , searchMode : function() {return 'select';}
					}
				}).result.then(function(sense) {
					if (sense) {
						$scope.tempExtRef.reference = sense.id;
                        $scope.checkNewExtRefReferences();
					}
				},
					function(result) {});
			};

			$scope.selectedExtSystemChanged = function() {
				$scope.tempExtRef.system = $scope.tempExtRef.sys_id.name;
                 $scope.checkNewExtRefReferences();
			};

			$scope.selectedExtRelTypeChanged = function() {
				$scope.tempExtRef.type_ref_code = $scope.tempExtRef.rel_type.name;
                 $scope.checkNewExtRefReferences();
			};
            
            $scope.checkNewExtRefReferences = function ()
            {
                console.log( '$scope.checkNewExtRefReferences');
                $scope.tempExtRef.error = null;
                if ( $scope.tempExtRef.system.length == 0 ) {
                    return;
                }
                if ( $scope.tempExtRef.reference.length == 0 ) {
                    return;
                }
                if ('eq_synonym' === $scope.tempExtRef.type_ref_code || 'eq_has_hyponym' === $scope.tempExtRef.type_ref_code ) {
                    spinnerService.show('searchSenseSpinner');
                    var checkExtRelPromise = wnwbApi.ExtRel.get({
                            reltype : $scope.tempExtRef.type_ref_code
                            , system : $scope.tempExtRef.system
                            , label : $scope.tempExtRef.reference
                            , lexid : $scope.sense.lexicon
                        }).$promise;
                     checkExtRelPromise.then(function (result) {
                        if (result['count'] > 0) {
                            //esialgu kasutame ainult esimest relationit
                            console.log('get sense', result['results'][0]['sense']);
                            refferedSensePromise = wnwbApi.Sense.get({id : result['results'][0]['sense']}).$promise;
                            refferedSensePromise.then(function(resultSense) {
                                spinnerService.hide('searchSenseSpinner');
                                 if ('eq_synonym' === $scope.tempExtRef.type_ref_code) {
                                    $scope.tempExtRef.type_ref_code = null;
                                    $scope.tempExtRef.rel_type.name = null;
                                    $scope.tempExtRef.rel_type.id = null;
                                    $scope.tempExtRef.error = 'Selected reference ' + $scope.tempExtRef.reference + ' is already used by sense DB_ID: ' + resultSense['id'] + ', Label: ' + resultSense['label'] + ' '+ resultSense['primary_definition'] + ' and can not be used again.';

                                 } else if ('eq_has_hyponym' === $scope.tempExtRef.type_ref_code ) {
                                    $scope.tempExtRef.error = 'Please note that selected reference ' + $scope.tempExtRef.reference + ' is already used by sense DB_ID:' + resultSense['id'] + ', Label: ' + resultSense['label'] + ' '+ resultSense['primary_definition'] + '.';
                                 }
                            });
                        } else {
                             spinnerService.hide('searchSenseSpinner');
                        }
                    });
                }
            }

			/////////////////
			// Sense methods
			/////////////////

			$scope.showDefinition = function() {
				$scope.secondaryView = 'definition';
			};

			$scope.showRelation = function() {
				$scope.secondaryView = 'relation';
			};

			$scope.saveAll = function() {
				$scope.saveExtRef();
			};

			$scope.validateSense = function(sense) {
				$scope.senseErrors = {};
				var fIsValid = true;
				if (!sense.lexical_entry || !sense.lexical_entry.lemma || !sense.lexical_entry.lemma.length) {
					$scope.senseErrors.lemma = {
						required : true
					};
					fIsValid = false;
				} else {
					sense.label = sense.lexical_entry.lemma + '__(' + sense.lexical_entry.part_of_speech + ')';
				}
				return fIsValid;
			};

			$scope.saveSense = function() {
				var d = $q.defer();
				var p = d.promise;

				$scope.saveAll();

				if ($scope.sense.id) {
					$log.log('Sense to save: id= ' + $scope.sense.id);
					if ($scope.currentSynSet !== undefined) {
						var fExists = false;
						for (var i = 0; i < $scope.currentSynSet.senses.length; i++) {
							if ($scope.currentSynSet.senses[i].id == $scope.sense.id) {
								$scope.currentSynSet.senses[i] = angular.copy($scope.sense);
								fExists = true;
								break;
							}
						}
						if (!fExists) {
							$scope.currentSynSet.senses.push(angular.copy($scope.sense));
						}
						d.resolve(true);
					}
				} else { // new sense
					$log.log('New Sense to save');

					var fExists = false;
					for (var i = 0; i < $scope.currentSynSet.senses.length; i++) {
						if (!$scope.currentSynSet.senses[i].id && $scope.currentSynSet.senses[i].lexical_entry.lemma == $scope.sense.lexical_entry.lemma) {
							$scope.currentSynSet.senses[i] = angular.copy($scope.sense);
							fExists = true;
							break;
						}
					}
					if (!fExists) {
						$scope.currentSynSet.senses.push(angular.copy($scope.sense));
					}
					d.resolve(true);
				}
				return p;
			};

			$scope.saveSensePromise = function() {
				var d = $q.defer();
				var p = d.promise;

				var fValid = true;

				if (!$scope.validateSense($scope.sense)) {
					fValid = false;
				}

				if (fValid) {
					$scope.saveSense().then(function() {
						d.resolve(true);
					});
				} else {
					d.resolve(false);
				}

				return p;
			};

			$scope.saveAction = function() {
				$scope.saveSensePromise().then(function(fSaved) {
					if (fSaved) {
						if ($scope.currentSynSet !== undefined) {
							$state.go('^', {
								senseId : $scope.sense.id
							});
						} else {
							$state.go('.', {
								senseId : $scope.sense.id
							}, {
								relative : $scope.baseState
							});
						}
					}
				});
			};

			$scope.discardSenseChanges = function() {
				$log.log('Sense discard '+ $scope.baseState.name);
				if ($scope.baseState.name == 'lexicon.synset_edit.sense_edit') {
					$scope.sense = angular.copy($scope.originalSense);
					$scope.sense = null;
					$scope.originalSense = {};
				}
				$state.go('^');
			};

			$scope.closeSenseView = function() {
				$state.go('^');
			};

			$scope.deleteAction = function() {
				if ($scope.sense.id) {
					// wnwbApi.Sense.remove({id: $scope.sense.id});
					anchorService.popSense($scope.sense);
					$scope.removeSense($scope.sense)
					$scope.sense = null;
					$scope.currentSense = null;
					$scope.originalSense = null;
				}
				if ($scope.baseState.name == 'lexicon.sense') {
					$state.go($scope.baseState, null, {
						reload : $scope.baseState
					});
				} else {
					$state.go('^');
				}
			};



			////////
			// Init
			////////

			$scope.init = function() {
				$log.log('Sense init');
				if (senseId > 0) {
					$log.log('Sense init by id');
					wnwbApi.Sense.get({
						id : senseId
					}).$promise.then(function(sense) {
						$scope.currentSense = sense;
						if ($scope.baseState.name == 'lexicon.sense') {
							anchorService.pushSense(sense);
						}
						lexiconService.setWorkingLexiconId(sense.lexicon);
						$scope.sense = sense;
						senseDeferred.resolve(sense);
					});
				} else if (!angular.equals($scope.sense, {})) {
					$log.log('Sense init by object');
					$scope.currentSense = $scope.sense;
					senseDeferred.resolve($scope.sense);
				} else {
					$log.log('Sense init new');
					var l_pos = 'n';
					if ($scope.currentSynSet) {
						l_pos = $scope.currentSynSet.senses[0].lexical_entry.part_of_speech;
					}
					$scope.sense = new wnwbApi.Sense();
					$scope.sense.lexical_entry = {
						lexicon : lexiconService.getWorkingLexicon().id,
						part_of_speech : l_pos,
						lemma : ''
					};
					$scope.sense.status = 'D';
					$scope.sense.nr = 0;
					$scope.sense.sense_definitions = [];
					$scope.sense.examples = [];
					$scope.sense.relations = [];
					$scope.sense.sense_externals = [];
					$scope.currentSense = $scope.sense;
					senseDeferred.resolve($scope.sense);
				}
			};

			$q.all([ lexiconService.getWorkingLexiconPromise() ]).then(function(qAllResults) {
				$scope.init();
			});

			sensePromise.then(function() {
				$scope.originalSense = angular.copy($scope.currentSense);
			});
		} ]);
});