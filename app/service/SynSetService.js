/**
 * Created by ivar on 28.01.16.
 */

define([
    'angularAMD',
    'underscore'
], function (angularAMD) {

    angularAMD.service('service/SynSetService', [ '$rootScope', '$log', '$q', 'wnwbApi',
        function($rootScope, $log, $q, wnwbApi) {
            var self = this;

            this.init = function ( callback ) {
                //self.load();

                if(callback) {
                    callback(true);
                }
            };

            this.load = function () {

            };

            this.getList = function () {

            };

            this.addRelation = function (synSet, relation) {

            };

            this.removeRelation = function (synSet, relation) {

            };

            this.getDefinitionById = function (synSet, definitionId) {
                for(k in synSet.synset_definitions) {
                    if(synSet.synset_definitions[k].id == definitionId) {
                        return synSet.synset_definitions[k];
                    }
                }

                return null;
            };

            this.addDefinition = function (synSet, definition) {
                synSet.synset_definitions.push(angular.copy(definition));
            };

            this.setDefinitions = function (synSet, definitionId, definition) {
                if(origDef == $scope.selectedDefinition) {
                    angular.copy(def, $scope.selectedDefinition);
                } else {
                    $scope.currentSynSet.synset_definitions.push(angular.copy(def));
                }
            };

            this.removeDefinition = function (synSet, definition) {

            };

            this.setPrimaryDefinition = function (synSet, definition) {
                for(var i = 0;i < synSet.synset_definitions.length;i++) {
                    synSet.synset_definitions[i].is_primary = false;
                }
                definition.is_primary = true;
            };

            this.addSense = function (synSet, sense) {

            };

            this.removeSense = function (synSet, sense) {

            };

            this.addExtRef = function (synSet, extRef) {

            };

            this.removeExtRef = function (synSet, extRef) {

            };
        }
    ]);
});