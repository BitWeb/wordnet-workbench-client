/**
 * Created by katrin on 12.04.17.
 */

define([
    'angularAMD',
    'service/LexiconService'
], function (angularAMD) {

    angularAMD.service('service/ExtendedSearchModalService', [ '$rootScope', '$log', '$sessionStorage', 'wnwbApi', 'service/LexiconService',
        function($rootScope, $log, $sessionStorage, wnwbApi, lexiconService) {
            var self = this;
            
            //$sessionStorage.filterFields=[]; 
            
            this.saveSearchFilter = function (filterFields) {
                if (filterFields.length) {
                    $sessionStorage.filterFields=filterFields;
                }
                else 
                {
                   $sessionStorage.filterFields=[]; 
                }

            };
            
            this.getSavedSearchFilter = function () {
                if ($sessionStorage.filterFields) {
                    return $sessionStorage.filterFields;
                }
                else {
                    
                    return [];
                }
                
            }
            
            
            
        }]);  
});