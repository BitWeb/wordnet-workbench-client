/**
 * Created by ivar on 17.01.16.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.service('service/UtilsService', [ '$rootScope', '$log',
        function($rootScope, $log) {
            var self = this;

            this.init = function ( callback ) {
                $rootScope.typeOf = function(val) { return typeof(val); };
                $rootScope.toInt = function(val) {
                    return parseInt(val,10);
                };
            };
        }
    ]);
});