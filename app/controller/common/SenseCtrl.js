/**
 * Created by ivar on 23.11.15.
 */

define([
    'angularAMD',
    'angular-animate'
], function (angularAMD) {

    angularAMD.controller('common/SenseCtrl', ['$scope','$state', '$stateParams', 'wnwbApi', '$animate', function ($scope, $state, $stateParams, wnwbApi, $animate) {

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



        $scope.selectedDefinition = null;
        $scope.tempDef = {};
        $scope.selectDefinitionForView = function (def) {
            $scope.selectedDefinition = def;
            if($scope.selectedDefinition) {
                //var index = $scope.sense.sense_definitions.indexOf($scope.selectedDefinition);
                $state.go('.def', {id: $scope.sense.id, defId: $scope.selectedDefinition.id}).then(function () {
                    $scope.$broadcast('sense-loaded', $scope.sense);
                });
            }
        };

        $scope.addSenseDefinition = function () {
            $state.go('.def_edit', {id: $scope.sense.id});
            $scope.selectedDefinition = {statements: []};
            $scope.$broadcast('sense-loaded', $scope.sense);
        };

        $scope.deleteSenseDefinition = function (definition) {
            var index = $scope.sense.sense_definitions.indexOf(definition);
            if (index > -1) {
                $scope.sense.sense_definitions.splice(index, 1);
            }
        };



        /*
         Example management
         */

        $scope.addExample = function () {
            var newExample = {
                text: '',
                language: $scope.language,
                source: ''
            };
            $scope.sense.examples.push(newExample);
            $scope.selectedExample = newExample;
            $scope.tempExample = angular.copy(newExample);
        };

        $scope.tempExample = {};
        $scope.selectedExample = null;

        $scope.editExample = function (example) {
            if($scope.selectedExample) {
                $scope.saveExample();
            }
            $scope.tempExample = angular.copy(example);
            $scope.tempExample.language = $scope.languageCodeMap[$scope.tempExample.language];
            $scope.selectedExample = example;
        };

        $scope.saveExample = function () {
            angular.copy($scope.tempExample, $scope.selectedExample);

            if($scope.selectedExample.language.code) {
                $scope.selectedExample.language = $scope.tempExample.language.code;
            } else {
                $scope.selectedExample.language = null;
            }
            $scope.cancelExample();
        };

        $scope.cancelExample = function () {
            $scope.selectedExample = null;
        };

        $scope.deleteExample = function (example) {
            var index = $scope.sense.examples.indexOf(example);
            if (index > -1) {
                $scope.sense.examples.splice(index, 1);
            }
        };



        /*
         Relation management
         */

        $scope.showRelation = function () {

        };

        $scope.addRelation = function () {

        };

        $scope.showRelation = function () {

        };



        /*
         Ext ref management
         */

        $scope.addExtRef = function () {
            var newExtRef = {
                system: '',
                type_ref_code: '',
                reference: ''
            };
            $scope.sense.sense_externals.push(newExtRef);
            $scope.selectedExtRef = newExtRef;
            $scope.tempExtRef = angular.copy(newExtRef);
        };

        $scope.tempExtRef = {};
        $scope.selectedExtRef = null;

        $scope.editExtRef = function (extRef) {
            if($scope.selectedExtRef) {
                $scope.saveExample();
            }
            $scope.tempExtRef = angular.copy(extRef);
            $scope.selectedExtRef = extRef;
        };

        $scope.saveExtRef = function () {
            angular.copy($scope.tempExtRef, $scope.selectedExtRef);
            $scope.cancelExtRef();
        };

        $scope.cancelExtRef = function () {
            $scope.selectedExtRef = null;
        };

        $scope.deleteExtRef = function (extRef) {
            var index = $scope.sense.sense_externals.indexOf(extRef);
            if (index > -1) {
                $scope.sense.sense_externals.splice(index, 1);
            }
        };



        $scope.showDefinition = function () {
            $scope.secondaryView = 'definition';
        };

        $scope.showRelation = function () {
            $scope.secondaryView = 'relation';
        };

        $scope.saveSense = function () {
            if($scope.sense.id) {
                //$scope.sense.lexical_entry = {lexicon: $scope.workingLexicon.id, part_of_speech: 'n', lemma: ''};

                $scope.sense.$update({id: $scope.sense.id}, function () {
                    //$state.go('^', {id: $scope.sense.id});
                    wnwbApi.Sense.get({id: senseId}, function () {
                        $scope.sense = sense;
                    });
                });

                if($scope.currentSynSet !== null) {
                    $state.go('.', {id: $scope.sense.id});
                }
            } else {
                $scope.sense.lexical_entry.lexicon = $scope.workingLexicon.id;
                var result = $scope.sense.$save(function () {
                    if($scope.currentSynSet !== null) {
                        $state.go('.', {id: $scope.sense.id});
                    }
                });
            }
        };

        $scope.discardSenseChanges = function () {

        };

    }]);
});