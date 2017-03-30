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

                if(callback) {
                    callback(true);
                }
            };

           this.load = function () {
            	fLexiconPromiseResolved = false;
                lexiconPromise = wnwbApi.Lexicon.query().$promise;

                lexiconPromise.then(function (data) {
                	 lexicons = data;

                    angular.forEach(lexicons, function (value, key) {
                        lexiconMap[value.id] = value;
                    });
                           
                    if ($rootScope.startUrlLexiconId) {
                       self.setWorkingLexiconIdStayStill($rootScope.startUrlLexiconId); 
                    } else if(storage.workingLexiconId) {
                        self.setWorkingLexiconId(storage.workingLexiconId);
                    } else {
                        $rootScope.$broadcast('noWorkingLexicon', workingLexicon);
                        $rootScope.$broadcast('LexiconService.noWorkingLexicon', workingLexicon);
                    }

                     fLexiconPromiseResolved = true;
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
                return lexiconPromise;
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
                        $rootScope.currentLexiconId = workingLexicon.id;
                        $rootScope.$broadcast('workingLexiconChanged', workingLexicon);
                        $rootScope.$broadcast('LexiconService.workingLexiconChange', workingLexicon);
                    }
                }
            };
            
            this.setWorkingLexiconIdStayStill = function (lexiconId) {               
                if(lexiconMap[lexiconId]) {
                    workingLexicon = lexiconMap[lexiconId];
                    storage.workingLexiconId = workingLexicon.id;
                    $rootScope.currentLexiconId = workingLexicon.id;
                    console.log('workingLexicon still...', workingLexicon);
                    $rootScope.$broadcast('workingLexiconChangedStayStill', workingLexicon);
                }
            };

            
            this.getLexiconById = function (lexiconId) {
            	lexicon = null
                if(lexiconMap[lexiconId]) {
                    lexicon = lexiconMap[lexiconId];
                }
            	return lexicon;
            };

        }
    ]);
});