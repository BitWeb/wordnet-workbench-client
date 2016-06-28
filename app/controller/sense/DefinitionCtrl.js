/**
 * Created by ivar on 15.12.15.
 */

define([
    'angularAMD',
    'service/ConfirmModalService'
], function (angularAMD) {

    angularAMD.controller('controller/sense/DefinitionCtrl', ['$scope','$state', '$stateParams', '$q', '$log', 'service/DirtyStateService', 'service/ConfirmModalService', function ($scope, $state, $stateParams, $q, $log, dirtyStateService, confirmModalService) {
        $log.log('controller/sense/DefinitionCtrl');

        if(!$scope.baseState) {
            $scope.baseState = $state.get('def');
        } else {
            $scope.baseState = $state.get($scope.baseState.name+'.def');
        }

        var dirtyStateHandlerUnbind = dirtyStateService.bindHandler($scope.baseState.name, function () {
            var dirtyDeferred = $q.defer();
            var dirtyPromise = dirtyDeferred.promise;
            if(angular.equals($scope.originalDef, $scope.tempDef)) {
                dirtyDeferred.resolve(true);
            } else {
                confirmModalService.open({ok: 'Confirm', text: 'Current definition contains unsaved changes. Are you sure you want to dismiss these changes?'}).then(function(result) {
                    if(result) {
                        dirtyDeferred.resolve(true);
                    } else {
                        dirtyDeferred.resolve(false);
                    }
                });
            }
            return dirtyPromise;
        });

        // Save propagation
        $scope.childMethodsObj = null;
        if($scope.childMethods) {
            $scope.childMethodsObj = $scope.childMethods;
            var saveFunc = function () {
                return $scope.saveDefinitionPromise();
            };
            $scope.childMethodsObj.propagatedSave = saveFunc;
        }
        $scope.childMethods = {propagatedSave: null};

        $scope.$on('$destroy', function (event) {
            if(dirtyStateHandlerUnbind) {
                dirtyStateHandlerUnbind();
            }
            if($scope.childMethodsObj) {
                $scope.childMethodsObj.propagatedSave = null;
            }
        });

        var defId = null;
        if($stateParams.defId) {
            defId = $stateParams.defId;
        }

        $scope.tempDef = {statements: []};
        $scope.originalDef = null;
        $scope.def = {};
        $scope.selectedStatement = null;
        $scope.tempStmt = {};
        $scope.errors = {};



        $scope.getDefinition(defId).then(function (def) {
            $log.log('Definition loaded');
            if(def) {
                $scope.def = def;
                $scope.tempDef = angular.copy(def);
                $scope.tempDef.language = $scope.languageCodeMap[$scope.tempDef.language];
                $scope.originalDef = angular.copy($scope.tempDef);
            } else {
                $scope.tempDef = {
                    language: $scope.language,
                    statements: []
                };
            }
        });

        $scope.addStatement = function () {
            if($scope.selectedStatement) {
                $scope.saveStatement();
            }
            var newStmt = {
                text: '',
                source: ''
            };
            $scope.tempDef.statements.push(newStmt);
            $scope.selectedStatement = newStmt;
            $scope.tempStmt = angular.copy(newStmt);
        };

        $scope.editStatement = function (statement) {
            if($scope.selectedStatement) {
                $scope.saveStatement();
            }
            $scope.tempStmt = angular.copy(statement);
            $scope.selectedStatement = statement;
        };

        $scope.saveStatement = function () {
            angular.copy($scope.tempStmt, $scope.selectedStatement);
            $scope.cancelEdit();
        };

        $scope.cancelEdit = function () {
            $scope.selectedStatement = null;
        };

        $scope.deleteStatement = function (statement) {
            var index = $scope.tempDef.statements.indexOf(statement);
            if (index > -1) {
                $scope.tempDef.statements.splice(index, 1);
            }
        };

        $scope.discardDefinition = function () {
            $state.go('^');
        };

        $scope.validateDefinition = function () {
            $scope.errors = {};
            if(!$scope.tempDef.language || !$scope.tempDef.language.code) {
                $scope.errors.language = {invalid: true};
                return false;
            }
            return true;
        };

        $scope.saveDefinition = function () {
            var d = $q.defer();
            var p = d.promise;

            $scope.originalDef = angular.copy($scope.tempDef);
            var saveDef = angular.copy($scope.tempDef);
            saveDef.language = saveDef.language.code;
            $scope.$parent.saveDefinition(saveDef, $scope.def);

            d.resolve(true);
            return p;
        };

        $scope.saveDefinitionPromise = function () {
            var d = $q.defer();
            var p = d.promise;

            var childPromise = null;
            if($scope.childMethods.propagatedSave && $scope.childMethods.propagatedSave) {
                childPromise = $scope.childMethods.propagatedSave();
            }

            if(!childPromise) {
                childPromise = $q.when(true);
            }
            childPromise.then(function (fChildrenSaved) {
                var fValid = true;

                if(!$scope.validateDefinition() || !fChildrenSaved) {
                    fValid = false;
                }

                if(fChildrenSaved && fValid) {
                    $scope.saveDefinition().then(function () {
                        d.resolve(true);
                    });
                } else {
                    d.resolve(false);
                }
            });

            return p;
        };

        $scope.saveDefinitionAction = function () {
            console.log('saveDefinitionAction');
            $scope.saveDefinitionPromise().then(function (fSaved) {
                console.log('saveDefinitionPromise then', fSaved);
                if(fSaved) {
                    $state.go('^');
                }
            });
        };
    }]);
});