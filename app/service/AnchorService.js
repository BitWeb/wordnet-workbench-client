/**
 * Created by ivar on 15.12.15.
 */

define([
    'angularAMD',
    'service/WorkingLexiconService',
    'service/LexiconService'
], function (angularAMD) {

    angularAMD.service('service/AnchorService', [ '$rootScope', '$log', '$sessionStorage', 'wnwbApi', 'service/WorkingLexiconService', 'service/LexiconService',
        function($rootScope, $log, $sessionStorage, wnwbApi, workingLexiconService, lexiconService) {
            var self = this;

            //$sessionStorage.anchors = undefined;

            var anchors = {};
            var workingLexicon = null;
            var workingAnchor = null;

            $rootScope.$on('workingLexiconChanged', function (event, newWorkingLexicon) {
                if(workingLexicon != newWorkingLexicon) {
                    workingLexicon = newWorkingLexicon;
                    $rootScope.$broadcast('anchorListChanged', anchors[workingLexicon.id], workingAnchor);
                } else {
                    if(!anchors[workingLexicon.id]) {
                        anchors[workingLexicon.id] = [];
                    }
                    workingAnchor = null;
                    if(anchors[workingLexicon.id].length) {
                        workingAnchor = anchors[workingLexicon.id][0];
                        $rootScope.$broadcast('anchorListChanged', anchors[workingLexicon.id], workingAnchor);
                    }
                }
            });

            this.init = function ( callback ) {
                if(!$sessionStorage.anchors) {
                    $sessionStorage.anchors = {};
                }

                anchors = $sessionStorage.anchors;

                console.log('AnchorService init');
                console.log(anchors);

                callback(true);
            };

            this.getAnchorList = function (workingLexiconId) {
                console.log('[AnchorService.js] getAnchorList ' + workingLexiconId);
                if(workingLexicon) {
                    if(anchors[workingLexicon.id]) {
                        return anchors[workingLexicon.id];
                    } else {
                        return [];
                    }
                }
            };

            this.pushSense = function (sense) {
                //update workingLexicon, anchorList
                if(sense.id) {
                    var lexiconId = sense.lexical_entry.lexicon.id;
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
                    $rootScope.$broadcast('anchorListChanged', anchors[lexiconId], workingAnchor);
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

                    console.log('push synset');

                    workingAnchor = {type: 'synSet', id: synSet.id, label: synSet.label};
                    anchors[lexiconId].unshift(workingAnchor);
                    $rootScope.$broadcast('anchorListChanged', anchors[lexiconId], workingAnchor);
                }
            };

            this.getWorkingAnchor = function () {
                /*if(anchors[workingLexicon.id]) {
                    return anchors[workingLexicon.id][0];
                } else {
                    return null;
                }*/
            };

        }
    ]);
});