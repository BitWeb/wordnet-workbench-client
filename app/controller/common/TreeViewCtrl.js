/**
 * Created by ivar on 15.12.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('TreeViewCtrl', ['$scope','$state', '$stateParams', 'wnwbApi', function ($scope, $state, $stateParams, wnwbApi) {
        console.log('TreeViewCtrl');

        $scope.delete = function(data) {
            data.nodes = [];
        };

        $scope.add = function(data) {
            var post = data.nodes.length + 1;
            var newName = data.name + '-' + post;
            data.nodes.push({name: newName,nodes: []});
        };

        $scope.tree = [{name: "Node", nodes: []}];

    }]);
});