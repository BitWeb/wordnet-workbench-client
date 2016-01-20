/**
 * Created by ivar on 15.01.16.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.service('service/LexiconService', [ '$rootScope', '$log', '$state', '$sessionStorage', '$localStorage', '$q', 'wnwbApi',
        function($rootScope, $log, $state, $sessionStorage, $localStorage, $q, wnwbApi) {
            var self = this;

            $log.log('LexiconService ctor');

            var storage = $localStorage;

            var lexicons = null;
            var lexiconMap = {};
            var workingLexicon = null;

            var deferred = $q.defer();

            this.init = function ( callback ) {
                wnwbApi.Lexicon.query(function (data) {
                    deferred.resolve(data);

                    lexicons = data;

                    angular.forEach(lexicons, function (value, key) {
                        lexiconMap[value.id] = value;
                    });

                    if(storage.workingLexiconId) {
                        self.setWorkingLexiconId(storage.workingLexiconId);
                    } else {
                        $rootScope.$broadcast('noWorkingLexicon', workingLexicon);
                        $rootScope.$broadcast('LexiconService.noWorkingLexicon', workingLexicon);
                    }

                    callback(deferred.promise);
                });
            };

            this.getLexicons = function () {
                return deferred.promise;
            };

            this.getWorkingLexicon = function () {
                return workingLexicon;
            };

            this.setWorkingLexicon = function (lexicon) {
                if(lexicon && lexiconMap[lexicon.id]) {
                    self.setWorkingLexiconId(lexicon.id);
                }
            };

            this.setWorkingLexiconId = function (lexiconId) {
                if(lexiconMap[lexiconId]) {
                    if(!workingLexicon || workingLexicon.id != lexiconId) {
                        workingLexicon = lexiconMap[lexiconId];
                        storage.workingLexiconId = workingLexicon.id;
                        $rootScope.$broadcast('workingLexiconChanged', workingLexicon);
                        $rootScope.$broadcast('LexiconService.workingLexiconChange', workingLexicon);
                    }
                }
            };

        }
    ]);
});