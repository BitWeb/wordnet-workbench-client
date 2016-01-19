/**
 * Created by ivar on 23.11.15.
 */

define([
    'angularAMD',
    'angular-animate'
], function (angularAMD) {

    angularAMD.controller('OrphanSenseCtrl', ['$scope','$state', '$stateParams', 'wnwbApi', '$animate', function ($scope, $state, $stateParams, wnwbApi, $animate) {

        var senseId = 0;
        if($stateParams.senseId) {
            senseId = $stateParams.senseId;
        }

        $scope.fShowDefinition = false;

        $scope.sense = {};
        if(senseId) {
            var sense = wnwbApi.Sense.get({id: senseId}, function () {
                $scope.sense = sense;

                $scope.$broadcast('sense-loaded', $scope.sense);

                //TODO: parse relations

                //TODO: parse ext refs
            });
        } else {
            //TODO: set lexicon on saving

            $scope.sense = new wnwbApi.Sense();
            $scope.sense.lexical_entry = {};//{lexicon: $scope.$storage.currentLexicon.id, part_of_speech: 'n', lemma: ''};
            $scope.sense.status = 'D';
            $scope.sense.nr = 1;
            $scope.sense.sense_definitions = [];
            $scope.sense.examples = [];
            $scope.sense.relations = [];
            $scope.sense.sense_externals = [];

            $scope.$broadcast('sense-loaded', $scope.sense);
        }

        $scope.saveSense = function () {
            //TODO: properly redirect to parent state
            //if synset state: redirect to synset
            //if

            if($scope.sense.id) {
                //$scope.sense.lexical_entry = {lexicon: $scope.workingLexicon.id, part_of_speech: 'n', lemma: ''};

                $scope.sense.$update({id: $scope.sense.id}, function () {
                    //$state.go('^', {id: $scope.sense.id});
                    wnwbApi.Sense.get({id: senseId}, function () {
                        $scope.sense = sense;
                    });
                });

                //$state.go('^', {id: $scope.synSet.id});
            } else {
                $scope.sense.lexical_entry.lexicon = $scope.workingLexicon.id;
                var result = $scope.sense.$save(function () {
                    $state.go('^', {id: $scope.sense.id});
                });
            }
        };

        $scope.discardSenseChanges = function () {

        };

    }]);
});