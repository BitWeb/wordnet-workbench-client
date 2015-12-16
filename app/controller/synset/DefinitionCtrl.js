/**
 * Created by ivar on 15.12.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('controller/synset/DefinitionCtrl', ['$scope','$state', '$stateParams', 'AuthService', function ($scope, $state, $stateParams, authService) {
        console.log('controller/synset/DefinitionCtrl');

        var defId = null;
        if($stateParams.defId !== null) {
            defId = $stateParams.defId;
        }

        $scope.tempDef = {statements: []};
        $scope.def = {};
        $scope.selectedStatement = null;
        $scope.tempStmt = {};

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

        $scope.saveDefinition = function () {
            if($scope.tempDef.id) {
                angular.copy($scope.tempDef, $scope.def);
            } else {
                var newDef = angular.copy($scope.tempDef);
                $scope.synSet.synset_definitions.push(newDef);
            }
            $state.go('^');
        };

        $scope.$on('synset-loaded', function (event, value) {
            //console.log('synset loaded');
            if(defId !== null) {
                for(k in $scope.synSet.synset_definitions) {
                    if($scope.synSet.synset_definitions[k].id == defId) {
                        $scope.def = $scope.synSet.synset_definitions[k];
                        break;
                    }
                }
                $scope.tempDef = angular.copy($scope.def);
            }
        });

    }]);
});