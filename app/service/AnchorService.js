/**
 * Created by ivar on 15.12.15.
 */

define([
    'angularAMD',
    'service/LexiconService'
], function (angularAMD) {

    angularAMD.service('service/AnchorService', [ '$rootScope', '$log', '$sessionStorage', 'wnwbApi', 'service/LexiconService',
        function($rootScope, $log, $sessionStorage, wnwbApi, lexiconService) {
            var self = this;

            $log.log('AnchorService ctor');

            var anchors = {};
            var workingLexicon = null;
            var workingAnchor = null;

            this.init = function ( callback ) {
                if(!$sessionStorage.anchors) {
                    $sessionStorage.anchors = {};
                }

                anchors = $sessionStorage.anchors;

                console.log('AnchorService init');
                console.log(anchors);

                callback(true);
            };

            this.getAnchorList = function () {
                var workingLexicon = lexiconService.getWorkingLexicon();
                if(workingLexicon) {
                    var workingLexiconId = workingLexicon.id;
                    if(workingLexiconId) {
                        if (anchors[workingLexiconId]) {
                            return anchors[workingLexiconId];
                        }
                    }
                }
                return [];
            };

            this.getAnchorListModel = function (workingLexiconId) {

            };

            this.pushSense = function (sense) {
                if(sense.id) {
                    var lexiconId = sense.lexical_entry.lexicon;
                    if(!anchors[lexiconId]) {
                        anchors[lexiconId] = [];
                    }
                    for(k in anchors[lexiconId]) {
                        if(anchors[lexiconId][k].type == 'sense' && anchors[lexiconId][k].id == sense.id) {
                            anchors[lexiconId].splice(k, 1);
                        }
                    }
                    workingAnchor = {type: 'sense', id: sense.id, label: sense.label};
                    anchors[lexiconId].unshift(workingAnchor);

                    $rootScope.$broadcast('AnchorService.anchorListChange', anchors[lexiconId], workingAnchor);
                }
            };

            this.pushSynSet = function (synSet) {
                if(synSet.id) {
                    var lexiconId = synSet.lexicon;
                    if(!anchors[lexiconId]) {
                        anchors[lexiconId] = [];
                    }
                    for (k in anchors[lexiconId]) {
                        if (anchors[lexiconId][k].type == 'synSet' && anchors[lexiconId][k].id == synSet.id) {
                            anchors[lexiconId].splice(k, 1);
                        }
                    }

                    workingAnchor = {type: 'synSet', id: synSet.id, label: synSet.label + ' ' + synSet.variants_str + ' - ' + synSet.primary_definition};
                    anchors[lexiconId].unshift(workingAnchor);

                    $rootScope.$broadcast('AnchorService.anchorListChange', anchors[lexiconId], workingAnchor);
                }
            };

            this.getWorkingAnchor = function () {
                if(anchors[workingLexicon.id]) {
                    return anchors[workingLexicon.id][0];
                } else {
                    return null;
                }
            };

        }
    ]);
});
