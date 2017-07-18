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
            var searchFilter = {};
            var searchLimit = 50;
            var searchType = 'synset';
            var searchTitle = 'Undefined';
            var RootFilter = {
                type: 'group',
                boolOp: 'OR',
                items : [ {type:'group', boolOp:'AND', items:[]}]
                };

            var filterTree = {};
            filterTree.synset = angular.copy(RootFilter);
            filterTree.sense = angular.copy(RootFilter);
            filterTree.lexentry = angular.copy(RootFilter);

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
                /*if (!$sessionStorage.extendedSearchSession)
                {
                    $sessionStorage.extendedSearchSession = extendedSearchSession;
                    $sessionStorage.extendedSearchSession.isSaved = true;

                }
                extendedSearchSession = $sessionStorage.extendedSearchSession;
                
                */
                this.resetFilterTree();
            };

            this.resetFilterTree = function(searchtype = null) {
                if (searchtype == null) {
                    filterTree.synset = angular.copy(RootFilter);
                    filterTree.sense = angular.copy(RootFilter);
                    filterTree.lexentry = angular.copy(RootFilter);
                }
                else {
                    filterTree[searchType] = angular.copy(RootFilter);
                }
            }

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
            
            this.getRootFilter = function () {
                 return RootFilter;
            }
            
            this.getFilterTree = function () {
                 return filterTree;
            }

            this.setFilterTree = function (filtertree) {
                filterTree = filtertree;
            }
            this.getSearchFilterRows = function () {
                 return extendedSearchSession.filterRows;
            }
            this.getSearchType = function () {
                    return extendedSearchSession.searchType;
              
            };  

            //FILTER SEARCH
            this.getLexentryFilterFieldsPromise = function() {
                return wnwbApi.LexicalEntrySearchOptions.query({}).$promise;
            };
            
            this.getSenseFilterFieldsPromise = function() {
                return wnwbApi.SenseSearchOptions.query({}).$promise;
            };
            
            this.getSynsetFilterFieldsPromise = function() {
                return wnwbApi.SynsetSearchOptions.query({}).$promise;
            };

            this.getLexEntrySearchPromise = function(filter, offset=0, limit=20) {
                var data = {};
                data.filter = filter;
                data.offset = offset;
                data.limit = limit;
                return wnwbApi.LexicalEntrySearch.query(data).$promise;
            }

            this.getSenseSearchPromise = function(filter, offset=0, limit=20) {
                var data = {};
                data.filter = filter;
                data.offset = offset;
                data.limit = limit;
                return wnwbApi.SenseSearch.query(data).$promise;
            }
            
            this.getSynsetSearchPromise = function(filter, offset=0, limit=20) {
                var data = {};
                data.filter = filter;
                data.offset = offset;
                data.limit = limit;
                return wnwbApi.SynsetSearch.query(data).$promise;
            }

            this.getSearchResultPromise = function(type, filter, offset=0, limit=20){
               
                if (type == 'lexentry') {
                    return this.getLexEntrySearchPromise(filter,offset,limit);
                }
                else if (type == 'sense') {
                    return this.getSenseSearchPromise(filter,offset,limit);
                }
                else  {
                    return this.getSynsetSearchPromise(filter,offset,limit);
                }
            }
             
            this.setSearchType = function(type) {
               searchType = type;
            }
            
            this.getSearchType = function() {
                return searchType;
            }

            this.setSearchQuery = function(query) {
               searchQuery = query;
            }
            
            this.getSearchQuery = function() {
                return searchQuery;
            }

            this.setSearchTitle = function(title) {
               searchTitle = title;
            }

            this.getSearchTitle = function() {
                return searchTitle;
            }

            this.setSearchLimit = function(limit) {
               searchLimit = limit;
            }

            this.getSearchLimit = function() {
                return searchLimit;
            }

            this.setSearchFilter = function(filter) {
               searchFilter = filter;
            }

            this.getSearchFilter = function(filter) {
                return searchFilter;
            }

            
            this.setSearchResult = function(result) {
                searchResult = result;
                $rootScope.$broadcast('newExtendedSearchResultChanged', result);
            }

            this.getSearchResult = function(result) {
                return searchResult;
            }
            
            //fields evaluation
            this.evaluateField = function (field) {
                if (field.selectedOps != 'isempty' && field.selectedOps != 'isnotempty') {
                    if (field.insertedValue == null || field.insertedValue == '' ) {
                       field.error = 1;
                       field.errorMessage = 'This field cannot be empty.';
                       return field;
                    }
                    if (field.type == 'N' && !(field.insertedValue.match(/^[0-9]+$/))) {
                       field.error = 1;
                       field.errorMessage = 'Numeric values only.';
                       return field;
                    }
                    if (field.insertedValue.length > field['length']) {
                       field.error = 1;
                       field.errorMessage = 'Inserted value exceed max length of ' + field['length'] + ' symbols.';
                       return field;
                    }
                }
                field.error = null;
                field.errorMessage = null;
                return field;
            }

            self.init();
 
        }]);
});