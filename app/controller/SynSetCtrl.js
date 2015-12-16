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

        var defId = 0;
        if($stateParams.defId !== null) {
            defId = $stateParams.defId;
        }
        $scope.selectedDefinition = null;

        if(synsetId) {
            var synSet = wnwbApi.SynSet.get({id: synsetId}, function () {
                $scope.synSet = synSet;

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
            var synSet = new wnwbApi.SynSet();
            synSet.label = 'test label';
            synSet.lexicon = $scope.$storage.currentLexicon.id;
            synSet.status = 'D';
            synSet.synset_definitions = [];
            synSet.relations = [];
            synSet.synset_externals = [];

            $scope.synSet = synSet;

        }

        /*
        Definition methods
         */
        $scope.selectedDefinition = null;
        $scope.tempDef = {};
        $scope.selectDefinition = function (def) {
            $scope.selectedDefinition = def;
            if($scope.selectedDefinition) {
                $state.go('synset.def', {id: $scope.synSet.id, defId: $scope.selectedDefinition.id}).then(function () {
                    console.log('broadcast def loaded 1');
                    $scope.$broadcast('definition-loaded', $scope.selectedDefinition);
                });
            }
        };

        $scope.requestDefinition = function (defId, callback) {
            if(defId) {
                var unregister = $scope.$watch('synSet', function(newValue, oldValue) {
                    if(newValue) {
                        console.log(newValue);
                        for (k in $scope.synSet.synset_definitions) {
                            if ($scope.synSet.synset_definitions[k].id == defId) {
                                $scope.selectedDefinition = $scope.synSet.synset_definitions[k];
                                break;
                            }
                        }
                        callback($scope.selectedDefinition);
                        unregister();
                    }
                });
            }
        };

        $scope.addDefinition = function () {
            $state.go('synset.def', {id: $scope.synSet.id});
            $scope.selectedDefinition = {statements: []};
            console.log('broadcast def loaded 2');
            $scope.$broadcast('definition-loaded', $scope.selectedDefinition);
        };

        $scope.deleteDefinition = function (definition) {
            var index = $scope.synSet.synset_definitions.indexOf(definition);
            if (index > -1) {
                $scope.synSet.synset_definitions.splice(index, 1);
            }
        };

        $scope.discardDefinition = function () {
            $state.go('synset');
        };

        $scope.saveDefinition = function (newDef) {
            if(newDef.id) {
                angular.copy(newDef, $scope.selectedDefinition);
            } else {
                $scope.synSet.synset_definitions.push(angular.copy(newDef));
            }
            $state.go('synset');
        };

        $scope.$on('definition-request', function (event, defId) {
            $scope.defId = defId;
        });



        /*
        Sense variants methods
         */
        $scope.selectSense = function (sense) {
            $state.go('.sense', {senseId: sense.id});
            $scope.selectedDefinition = null;
            $scope.$broadcast('synset-loaded', $scope.synSet);
        };

        $scope.removeSense = function (sense) {
            var index = $scope.synSet.synset_definitions.indexOf(definition);
            if (index > -1) {
                $scope.synSet.synset_definitions.splice(index, 1);
            }
        };

        $scope.createSense = function () {

        };

        $scope.addSense = function () {

        };

        /*
        Relation methods
         */
        $scope.addRelation = function () {

        };

        $scope.selectRelation = function (relation) {

        };

        $scope.deleteRelation = function (relation) {

        };

        /*
        Synset methods
         */
        $scope.saveSynSet = function () {
            if($scope.synSet.id) {
                $scope.synSet.$update({id: $scope.synSet.id});
            } else {
                var result = $scope.synSet.$save(function () {
                    $state.go('synset', {id: $scope.synSet.id});
                });
            }
        };

        $scope.discardSynSetChanges = function () {

        };
    }]);
});