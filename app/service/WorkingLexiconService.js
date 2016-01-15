/**
 * Created by ivar on 21.11.15.
 */

define(['angularAMD'], function (angularAMD) {

    angularAMD.service('service/WorkingLexiconService', [ '$rootScope', '$log', '$sessionStorage', 'wnwbApi',
        function($rootScope, $log, $sessionStorage, wnwbApi) {
            var self = this;

            var lexicons = null;
            var lexiconMap = {};
            var workingLexicon = null;

            this.init = function ( callback ) {
                wnwbApi.Lexicon.query(function (data) {
                    lexicons = data;

                    angular.forEach(lexicons, function (value, key) {
                        lexiconMap[value.id] = value;
                    });

                    workingLexicon = lexiconMap[$sessionStorage.workingLexiconId];

                    $rootScope.$broadcast('workingLexiconChanged', workingLexicon);

                    callback(true);
                });
            };

            this.getLexicons = function () {
                return lexicons;
            };

            this.getWorkingLexicon = function () {
                return workingLexicon;
            };

            this.setWorkingLexicon = function (lexicon) {
                workingLexicon = lexiconMap[lexicon.id];
                $sessionStorage.workingLexiconId = workingLexicon.id;
                $rootScope.$broadcast('workingLexiconChanged', workingLexicon);
            };

            this.setWorkingLexiconId = function (lexiconId) {
                workingLexicon = lexiconMap[lexiconId];
                $sessionStorage.workingLexiconId = workingLexicon.id;
                $rootScope.$broadcast('workingLexiconChanged', workingLexicon);
            };

        }
    ]);
});