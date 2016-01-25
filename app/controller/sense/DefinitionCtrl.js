/**
 * Created by ivar on 15.12.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('controller/sense/DefinitionCtrl', ['$scope','$state', '$stateParams', '$log', 'AuthService', function ($scope, $state, $stateParams, $log, authService) {
        $log.log('controller/sense/DefinitionCtrl');

        //synset/has to be loaded

        var defId = null;
        if($stateParams.defId) {
            defId = $stateParams.defId;
        }

        $scope.tempDef = {statements: []};
        $scope.def = {};
        $scope.selectedStatement = null;
        $scope.tempStmt = {};

        $scope.getDefinition(defId).then(function (def) {
            $log.log('Definition loaded');
            $log.log(def);
            if(def) {
                $scope.def = def;
                $scope.tempDef = angular.copy(def);
                $scope.tempDef.language = $scope.languageCodeMap[$scope.tempDef.language];
            } else {
                $scope.tempDef = {
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
            $state.go('^', {id: $scope.sense.id});
        };

        $scope.saveDefinition = function () {
            $scope.tempDef.language = $scope.tempDef.language.code;
            $scope.$parent.saveDefinition($scope.tempDef, $scope.def);
            $state.go('^');
        };

    }]);
});