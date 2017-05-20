/**
 * Created by ivar on 15.12.15.
 */

define([
	'angularAMD',
	'service/ConfirmModalService'
], function(angularAMD) {

	angularAMD.controller('controller/sense/DefinitionCtrl', [ '$scope', '$state', '$stateParams', '$q', '$log', 'service/DirtyStateService', 'service/ConfirmModalService', function($scope, $state, $stateParams, $q, $log, dirtyStateService, confirmModalService) {
		$log.log('controller/sense/DefinitionCtrl');

		$scope.baseState = $scope.state;

		$scope.$on('$destroy', function(event) {
			$log.log('controller/sense/DefinitionCtrl.onDestroy');
		});

		var defId = null;
		if ($stateParams.defId) {
			defId = $stateParams.defId;
		}

		$scope.tempDef = {
			language : $scope.language,
			statements : []
		};
		$scope.originalDef = null;
		$scope.def = {};
		$scope.selectedStatement = null;
		$scope.tempStmt = {};
		$scope.errors = {};

		$scope.getDefinition(defId).then(function(def) {
			$log.log('controller/sense/DefinitionCtrl.getDefinition');
			if (def) {
				$log.log('Definition loaded; ' + $scope.state.name);
				$scope.def = def;
				$scope.tempDef = angular.copy(def);
				if (!def.language.language) {
					$scope.tempDef.language = $scope.languageCodeMap[def.language];
				}
				$scope.originalDef = angular.copy($scope.tempDef);
			} else {
				$log.log('New definition loaded; ' + $scope.state.name);
				$scope.tempDef = {
					language : $scope.language,
					statements : []
				};
			}
		});

		$scope.addStatement = function() {
			if ($scope.selectedStatement) {
				$scope.saveStatement();
			}
			var newStmt = {
				text : '',
				source : ''
			};
			$scope.tempDef.statements.push(newStmt);
			$scope.selectedStatement = newStmt;
			$scope.tempStmt = angular.copy(newStmt);
		};

		$scope.editStatement = function(statement) {
			if ($scope.selectedStatement) {
				$scope.saveStatement();
			}
			$scope.tempStmt = angular.copy(statement);
			$scope.selectedStatement = statement;
		};

		$scope.saveStatement = function() {
			angular.copy($scope.tempStmt, $scope.selectedStatement);
			$scope.cancelEdit();
		};

		$scope.cancelEdit = function() {
			$scope.selectedStatement = null;
		};

		$scope.deleteStatement = function(statement) {
			var index = $scope.tempDef.statements.indexOf(statement);
			if (index > -1) {
				$scope.tempDef.statements.splice(index, 1);
			}
		};

		$scope.discardDefinition = function() {
			$log.log('controller/sense/DefinitionCtrl.discardDefinition');
			$state.go('^');
		};

		$scope.closeDefinition = function() {
			$log.log('controller/sense/DefinitionCtrl.closeDefinition');
			$state.go('^');
		};

		$scope.validateDefinition = function() {
			$log.log('controller/sense/DefinitionCtrl.validateDefinition');
			$scope.errors = {};
			if (!$scope.tempDef.language || !$scope.tempDef.language.code) {
				$scope.errors.language = {
					invalid : true
				};
				return false;
			}
			return true;
		};

		$scope.saveDefinition = function() {
			$log.log('controller/sense/DefinitionCtrl.saveDefinition');
			var d = $q.defer();
			var p = d.promise;

			$scope.originalDef = angular.copy($scope.tempDef);
			var saveDef = angular.copy($scope.tempDef);
			saveDef.language = saveDef.language.code;
			$scope.$parent.saveDefinition(saveDef, $scope.def);

			d.resolve(true);
			return p;
		};

		$scope.saveDefinitionPromise = function() {
			$log.log('controller/sense/DefinitionCtrl.saveDefinitionPromise');
			var d = $q.defer();
			var p = d.promise;

			var fValid = true;

			if (!$scope.validateDefinition()) {
				fValid = false;
			}

			if (fValid) {
				$scope.saveDefinition().then(function() {
					d.resolve(true);
				});
			} else {
				d.resolve(false);
			}

			return p;
		};

		$scope.saveDefinitionAction = function() {
			console.log('... saveDefinitionAction');
			$scope.saveDefinitionPromise().then(function(fSaved) {
				console.log('... saveDefinitionPromise then', fSaved);
				if (fSaved) {
					$state.go('^');
				}
			});
		};
	} ]);
});