/**
 * Created by katrin on 12.04.17.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.service('service/ExtendedSearchModalService', [ '$rootScope', '$log', '$sessionStorage', 'wnwbApi', 
        function($rootScope, $log, $sessionStorage, wnwbApi) {
            var self = this;
            var searchResult = [];
            var searchType = 'Undefined';
            var searchTitle = 'Undefined';
            
            
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
                $sessionStorage.extendedSearchSession.isSaved = 1;
                $sessionStorage.extendedSearchSession.filterRows = filterRows;
            };
            
            this.saveSearchType = function (searchType) {
                 $sessionStorage.extendedSearchSession.searchType = searchType;
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
            
            this.setSearchType = function(type){
               searchType = type;
            }
            
            this.getSearchType = function(){
                return searchType;
            }

            this.setSearchTitle = function(title){
               searchTitle = title;
            }

            this.getSearchTitle = function(){
                return searchTitle;
            }

            this.setSearchResult = function(result){
                searchResult = result;
            }

            this.getSearchResult = function(result){
                return searchResult;
            }
            
            self.init();
            
        }]);
});