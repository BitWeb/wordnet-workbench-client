/**
 * Created by ivar on 16.12.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('controller/DefCtrl', ['$scope','$state', '$stateParams', 'AuthService', function ($scope, $state, $stateParams, authService) {
        console.log('controller/DefCtrl');

        var defId = null;
        if($stateParams.defId !== null) {
            defId = $stateParams.defId;
        }

        console.log('def id: '+defId);

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
            $scope.$parent.discardDefinition();
        };

        $scope.saveDefinition = function () {
            $scope.$parent.saveDefinition(tempDef);
        };

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $scope.requestDefinition(defId, function (def) {
                $scope.tempDef = angular.copy(def);
            });
        });

    }]);
});