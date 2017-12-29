/**
 * Created by ivar on 15.01.16.
 */

define([
    'angularAMD'
], function (angularAMD) {


   angularAMD.service('service/LexiconService', [ '$rootScope', '$log', '$state', '$sessionStorage', '$localStorage', 'wnwbApi',
        function($rootScope, $log, $state, $sessionStorage, $localStorage, wnwbApi) {
            var self = this;

            var storage = $localStorage;

            var lexicons = null;
            var lexiconMap = {};
            var workingLexicon = null;
            
            var lexiconPromise = null;
            var fLexiconPromiseResolved = false;

            this.init = function ( callback ) {
                self.load();

                if (callback) {
                    callback(true);
                }
            };

           this.load = function () {
            	fLexiconPromiseResolved = false;
                lexiconPromise = wnwbApi.Lexicon.query().$promise;

                lexiconPromise.then(function (data) {
                    result = false;
                	lexicons = data;

                    angular.forEach(lexicons, function (value, key) {
                        lexiconMap[value.id] = value;
                    });
                    $rootScope.lexicons = lexicons;
                           
                    if ($rootScope.startUrlLexiconId) {
                        result = self.setWorkingLexiconIdStayStill($rootScope.startUrlLexiconId);
                    } else if(storage.workingLexiconId) {
                        result = self.setWorkingLexiconId(storage.workingLexiconId);
                    } else {
                        $rootScope.$broadcast('noWorkingLexicon', workingLexicon);
                        $rootScope.$broadcast('LexiconService.noWorkingLexicon', workingLexicon);
                    }

                    fLexiconPromiseResolved = result;
                });
            }

            this.getLexicons = function () {
            	if (!lexiconPromise) {
            		$log.warn('[service/LexiconService] getLexicons(): init() hasn\'t been run before.');
                    self.init();
            	}
                return lexiconPromise;
            };

            this.getWorkingLexicon = function () {
            	if (!workingLexicon) {
            		self.init();
            	}
        		return workingLexicon;
            };

            this.getWorkingLexiconPromise = function () {
                if (!lexiconPromise) {
                    self.init();
                }
                return lexiconPromise;
            };

            this.setWorkingLexicon = function (lexicon) {
                if (lexicon && lexiconMap[lexicon.id]) {
                    return self.setWorkingLexiconId(lexicon.id);
                }
                return false;
            };

            this.setWorkingLexiconId = function (lexiconId) {
                if (lexiconMap[lexiconId]) {
                    if (!workingLexicon || workingLexicon.id != lexiconId) {
                        workingLexicon = lexiconMap[lexiconId];
                        storage.workingLexiconId = workingLexicon.id;
                        $rootScope.currentLexiconId = workingLexicon.id;
                        $rootScope.$broadcast('workingLexiconChanged', workingLexicon);
                        $rootScope.$broadcast('LexiconService.workingLexiconChange', workingLexicon);
                        return true;
                    }
                }
                return false;
            };
            
            this.setWorkingLexiconIdStayStill = function (lexiconId) {               
                if (lexiconMap[lexiconId]) {
                    workingLexicon = lexiconMap[lexiconId];
                    storage.workingLexiconId = workingLexicon.id;
                    $rootScope.currentLexiconId = workingLexicon.id;
                    console.log('workingLexicon still...', workingLexicon);
                    $rootScope.$broadcast('workingLexiconChangedStayStill', workingLexicon);
                    return true;
                }
                return false;
            };

            
            this.getLexiconById = function (lexiconId) {
            	lexicon = null
                if (lexiconMap[lexiconId]) {
                    lexicon = lexiconMap[lexiconId];
                }
            	return lexicon;
            };

        }
    ]);
});