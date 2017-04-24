/**
 * Created by katrin on 12.04.17.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.service('service/ExtendedSearchModalService', [ '$rootScope', '$log', '$sessionStorage', 'wnwbApi', 
        function($rootScope, $log, $sessionStorage, wnwbApi) {
            var self = this;
            
            //$sessionStorage.filterFields=[]; 
            
            this.saveSearchFilterRows = function (filterRows) { 
                $sessionStorage.extendedSearchFilterRows = filterRows;
            };
            
            this.saveSearchType = function (searchType) {
                 $sessionStorage.extendedSearchSearchType = searchType;
            };
            
            this.getSearchFilterRows = function () {
                if ($sessionStorage.extendedSearchFilterRows) {
                    return $sessionStorage.extendedSearchFilterRows;
                } else {
                    return false;
                }
            }
            this.getSearchType = function () {
                if ($sessionStorage.extendedSearchSearchType.length){
                    return $sessionStorage.extendedSearchSearchType;
                } else {
                   return false; 
                }
            };      
            
        }]);  
});