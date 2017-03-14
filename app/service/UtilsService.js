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
                
                $rootScope.iterateToArray = function (obj, stack, arr=[]) {
                	
                    for (var property in obj) {
                        if (obj.hasOwnProperty(property)) {
                            if (typeof obj[property] == "object") {
                                arr.concat($rootScope.iterateToArray(obj[property], stack + '.' + property, arr));
                            } else {
                            	arr.push(stack + '.' + property + "   " + obj[property]);
                                
                            }
                        }
                    }
                    
                    return arr;
                };
                
                
            }; 
        }
    ]);
});