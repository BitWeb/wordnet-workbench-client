define([
    'angularAMD',
    'underscore',
    'TreeViewCtrl'
], function (angularAMD) {

    angularAMD.controller('SynSetCtrl', ['$scope', '$state', '$stateParams', 'wnwbApi', function ($scope, $state, $stateParams, wnwbApi) {
        console.log('SynSet Controller');

        var synsetId = 0;
        if($stateParams.id) {
            synsetId = $stateParams.id;
        }

        if(synsetId) {
            var synSet = wnwbApi.SynSet.get({id: synsetId}, function () {
                $scope.synSet = synSet;

                console.log(synSet.relations);

                /*var test = _
                    .chain(synSet.relations)
                    .groupBy('rel_type')
                    .map(function(value, key) {
                        return {
                            rel_type: key,
                            relations: _.pluck(value, 'id')
                        }
                    })
                    .value();

                console.debug(synSet.relations);*/
            });
        } else {
            $scope.synSet = new wnwbApi.SynSet();
        }


        console.log('SynSet Controller done');
    }]);
});