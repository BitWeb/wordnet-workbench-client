/**
 * Created by ivar on 15.01.16.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.service('service/TestService', [ '$rootScope', '$log', '$state', '$sessionStorage', '$q', 'wnwbApi',
        function($rootScope, $log, $state, $sessionStorage, $q, wnwbApi) {
            console.log('TestService');

            var self = this;

            var lexicons = null;
            var lexiconMap = {};
            var workingLexicon = null;

            this.init = function ( callback ) {

            };

            this.a = 10;

        }
    ]);
});