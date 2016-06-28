/**
 * Created by Ivar on 21.01.2016.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('controller/synset/RelationTrees', ['$scope','$state', '$stateParams', '$log', 'wnwbApi', function ($scope, $state, $stateParams, $log, wnwbApi) {
        $log.log('controller/synset/RelationTrees');

        $scope.anchorSynSetId = null;
        $scope.anchorSynSet = null;

        $scope.hyperonymRelTree = [];
        $scope.hyponymRelTree = [];
        $scope.firstHyponymRelTree = [];
        $scope.siblingRelTree = [];
        $scope.otherRelTree = [];

        $scope.anchorSynSetPromise.then(function (synSet) {
            $scope.anchorSynSetId = synSet.id;
            $scope.anchorSynSet = synSet;

            var hyperonymRelTreePromise = wnwbApi.HyperonymRelTree.get({id: $scope.anchorSynSetId}).$promise;
            var hyponymRelTreePromise = wnwbApi.HyponymRelTree.get({id: $scope.anchorSynSetId}).$promise;
            var siblingRelTreePromise = wnwbApi.SiblingRelTree.get({id: $scope.anchorSynSetId}).$promise;
            var otherRelTreePromise = wnwbApi.OtherRelTree.get({id: $scope.anchorSynSetId}).$promise;

            hyperonymRelTreePromise.then(function (result) {
                treeData = _.groupBy(result, 'a_synset');

                var rootCollection = [];
                $scope.hyperonymRelTree.push({id: synSet.id, name: synSet.label + ' ' + synSet.variants_str + ' - ' + synSet.primary_definition, nodes: rootCollection});

                var buildFunc = function (nodeCollection, synSetId) {
                    for(k in treeData[synSetId]) {
                        var children = [];
                        nodeCollection.push({id: treeData[synSetId][k].b_synset, name: treeData[synSetId][k].synset_text, nodes: children});
                        buildFunc(children, treeData[synSetId][k].b_synset);
                    }
                };
                buildFunc(rootCollection, synSet.id);
            });

            hyponymRelTreePromise.then(function (result) {
                treeData = _.groupBy(result, 'a_synset');

                {
                    var rootCollection = [];
                    $scope.firstHyponymRelTree.push({id: synSet.id, name: synSet.label + ' ' + synSet.variants_str + ' - ' + synSet.primary_definition, nodes: rootCollection});

                    var buildFunc = function (nodeCollection, synSetId) {
                        for (k in treeData[synSetId]) {
                            var children = [];
                            nodeCollection.push({id: treeData[synSetId][k].b_synset, name: treeData[synSetId][k].synset_text, nodes: children});
                        }
                    };
                    buildFunc(rootCollection, synSet.id);
                }
                {
                    var rootCollection = [];
                    $scope.hyponymRelTree.push({id: synSet.id, name: synSet.label + ' ' + synSet.variants_str + ' - ' + synSet.primary_definition, nodes: rootCollection});

                    var buildFunc = function (nodeCollection, synSetId) {
                        for (k in treeData[synSetId]) {
                            var children = [];
                            nodeCollection.push({id: treeData[synSetId][k].b_synset, name: treeData[synSetId][k].synset_text, nodes: children});
                            buildFunc(children, treeData[synSetId][k].b_synset);
                        }
                    };
                    buildFunc(rootCollection, synSet.id);
                }
            });

            siblingRelTreePromise.then(function (result) {
                $scope.siblingRelTree.push({id: synSet.id, name: synSet.label + ' ' + synSet.variants_str + ' - ' + synSet.primary_definition, nodes: []});

                angular.forEach(result, function (v, k) {
                    $scope.siblingRelTree.push({id: v.b_synset, name: v.synset_text, nodes: []});
                });
            });

            otherRelTreePromise.then(function (result) {
                treeData = _.groupBy(result, 'rel_text');

                for(relType in treeData) {
                    var relCollection = [];
                    $scope.otherRelTree.push({name: relType, nodes: relCollection});
                    for(k in treeData[relType]) {
                        relCollection.push({id: treeData[relType][k].b_synset, name: treeData[relType][k].synset_text, nodes: []});
                    }
                }
            });
        });

        $scope.selectHyponymById = function (synSetId, node) {
            $scope.selectSynsetById(synSetId);

            var hyponymRelTreePromise = wnwbApi.HyponymRelTree.get({id: synSetId}).$promise;

            $log.log('test '+node.id);
            hyponymRelTreePromise.then(function (result) {
                $log.log(result);
                treeData = _.groupBy(result, 'a_synset');

                var rootCollection = [];

                var buildFunc = function (nodeCollection, synSetId) {
                    for (k in treeData[synSetId]) {
                        var children = [];
                        nodeCollection.push({id: treeData[synSetId][k].b_synset, name: treeData[synSetId][k].synset_text, nodes: children});
                        buildFunc(children, treeData[synSetId][k].b_synset);
                    }
                };
                buildFunc(rootCollection, node.id);
                node.nodes = rootCollection;
                $log.log(rootCollection);
            });
        };

        $scope.selectAnchor = function (synSetId) {
            //TODO: update anchor
            $state.go('synset', {id: synSetId});
        };

    }]);
});
