/**
 * Created by katrin on 12.04.17.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.service('service/ExtendedSearchModalService', [ '$rootScope', '$log', '$sessionStorage', 'wnwbApi', 
        function($rootScope, $log, $sessionStorage, wnwbApi) {
            var self = this;
            
            
            var extendedSearchSession = {
                isSaved:0,
                filterRows: {
                    synset: []
                    , lexentry : []
                    , sense: []
                },
                searchType: 'synset'
            };
            
            
            this.init = function () {
                if (!$sessionStorage.extendedSearchSession)
                {
                    $sessionStorage.extendedSearchSession = extendedSearchSession;
                    $sessionStorage.extendedSearchSession.isSaved = true;

                }
                extendedSearchSession = $sessionStorage.extendedSearchSession;
                
            };
            
            this.isSavedFilter = function() {
                return extendedSearchSession.isSaved;  
            }
            
            this.saveSearchFilterRows = function (filterRows) { 
                extendedSearchSession.isSaved = true;
                extendedSearchSession.filterRows = filterRows;
            };
            
            this.saveSearchType = function (searchType) {
                 extendedSearchSession.searchType = searchType;
            };
            
            this.getSearchFilterRows = function () {
                 return extendedSearchSession.filterRows;
            }
            this.getSearchType = function () {
                    return extendedSearchSession.searchType;
              
            };  
            
            
            this.getLexentryFilterFieldsPromise = function(){  
                return wnwbApi.LexicalEntrySearchOptions.query({}).$promise;
            };
            
            this.getSenseFilterFieldsPromise = function(){    
                return wnwbApi.SenseSearchOptions.query({}).$promise;
            };
            
            this.getSynsetFilterFieldsPromise = function(){
                return wnwbApi.SynsetSearchOptions.query({}).$promise;
            };
            
           
            
           self.init();
            
        }]);
});