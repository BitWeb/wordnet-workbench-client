/**
 * Created by ivar on 15.12.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('controller/sense/DefinitionCtrl', ['$scope','$state', '$stateParams', 'AuthService', function ($scope, $state, $stateParams, authService) {
        console.log('controller/sense/DefinitionCtrl');

        var defId = null;
        if($stateParams.defId !== null) {
            defId = $stateParams.defId;
        }

        $scope.tempDef = {};
        $scope.def = {};
        $scope.selectedStatement = null;
        $scope.tempStmt = {};

        $scope.addStatement = function () {
            //push row
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
            $state.go('sense', {id: $scope.sense.id});
        };

        $scope.saveDefinition = function () {
            if($scope.tempDef.id) {
                angular.copy($scope.tempDef, $scope.def);
            }
            $state.go('sense', {id: $scope.sense.id});
        };

        $scope.$on('sense-loaded', function (event, value) {
            console.log('sense loaded');
            if(defId !== null) {
                for(k in $scope.sense.sense_definitions) {
                    if($scope.sense.sense_definitions[k].id == defId) {
                        $scope.def = $scope.sense.sense_definitions[k];
                        break;
                    }
                }
                $scope.tempDef = angular.copy($scope.def);
            }
        });

    }]);
});