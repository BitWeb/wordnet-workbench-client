/**
 * Created by ivar on 1.12.15.
 */

define([
	'angularAMD',
    'service/LexiconService',
    'service/ExtendedSearchModalService'
], function(angularAMD) {

	angularAMD.controller('main/ExtendedSearchCtrl', [ '$scope', '$rootScope', '$q', '$state', '$log', '$http', '$uibModal', '$uibModalInstance', 'wnwbApi',  'spinnerService', 'service/ExtendedSearchModalService', function($scope, $rootScope, $q, $state, $log, $http, $uibModal, $uibModalInstance, wnwbApi,  spinnerService, extendedSearchModalService) {

		$log.log('main/ExternalSearchCtrl');
          
        var SearchTypes = {
                synset      : 'Synset',
                lexentry    : 'Lexentry',
                sense       : 'Sense'
        
        };
     
        var Fields = {
                synset : {},
                sense : {},
                lexentry : {}
        };
       
        var Types = {
                I : {
                        regexp :'\\d+',
                        errorMessage : 'Only numeric values are allowed.'
                      },
                N : {
                        regexp :'\\d+',
                        errorMessage : 'Only numeric values are allowed.'
                      }
        };
         
        var SearchResult = null;
        
        var initSearchParams = function (hash, searchtype)
        {
            var fieldsDict = {};
   
            $scope.searchTitle[searchtype] = hash.name;
            parameters = hash.parameters;
            
            relations = {};
            
            //relations hash
            for (el in hash.relations) {
              relations[hash.relations[el][0]] = hash.relations[el][1];    
            }
              
            //fields from array to hash
            for (el in parameters) {
                if (parameters[el].field) {
                    if (parameters[el].values=='[relations]') {
                          parameters[el].relations = relations; 
                    }
                    else if (parameters[el].values && parameters[el].values!='*') {
                       var fixedValues =  (parameters[el].values).split(',');
                        parameters[el].fixedValues = fixedValues;
                    }                  
                   fieldsDict[parameters[el].field] =  parameters[el];
                }
            }
            $scope.Fields[searchtype] = fieldsDict;
        }
  
        var RootFilter = {
                type: 'group',
                boolOp: 'OR',
                items : [ {type:'group', boolOp:'AND', items:[]}]
                };
        
        $scope.filterTree = {};
        $scope.searchTitle = {};
        
          
        $scope.filterTree.synset = {};
        $scope.filterTree.sense = {};
        $scope.filterTree.lexentry = {};
         
        $scope.init = function (qAllResults) {
            if (!$scope.selectedSearchType) {
                $scope.selectedSearchType = 'synset'; 
                }
                
            $scope.Fields = Fields;
                
            initSearchParams(qAllResults[0][0], 'synset'); 
            initSearchParams(qAllResults[1][0], 'sense'); 
            initSearchParams(qAllResults[2][0], 'lexentry'); 

                
            $scope.TypeValidation = Types;
            $scope.searchTypes = SearchTypes;
              
        
                
            $scope.filterTree.synset = angular.copy(RootFilter);
            $scope.filterTree.sense = angular.copy(RootFilter);
            $scope.filterTree.lexentry = angular.copy(RootFilter);
        
        };
        
        $scope.changeSearchType = function(key) {        
            $scope.selectedSearchType = key;
        }
        
        $scope.resetFilter = function(searchType) {
              $scope.filterTree[searchType] =  angular.copy(RootFilter);
        } 
            
        $scope.cancel = function() {
              $uibModalInstance.close(null);
          }
		
        var evaluateFilterTree = function(items) {
            for (key in items) {
                if (items[key].type =='group') {    
                    evaluateFilterTree(items[key].items);
                } else if (items[key].type=='field') {
                    console.debug('items', items[key].field.insertedValue);
                }
            }
            return true;
        }
          
          
        $scope.evaluateAndDoSearch = function () {
            if(evaluateFilterTree($scope.filterTree[$scope.selectedSearchType].items)) {
                $scope.doSearch();
            }
        }
             
        var constructFilter = function (element) {
            if (element.type=='group') {     
                var Group = {type:'bool', op: (element.boolOp).toLowerCase(), exps : []};
                for (key in element.items) {
                   Group.exps.push(constructFilter(element.items[key]));
                }  
                return Group;
            } else if (element.type=='field') {
                
                if (element.field.selectedOps == 'isempty')
                {
                    element.field.insertedValue = null;  
                }
                return { type:'simple'
                        , field: element.field.field
                        , op : element.field.selectedOps
                        , value: element.field.insertedValue };
            
            }
        }
  
        $scope.doSearch = function() {
            var Filter = constructFilter($scope.filterTree[$scope.selectedSearchType]);
            //console.debug(Filter);
           /* var data = {filter:
                { type:"bool", op: "and", exps: [
                    { type:"simple", field:"date_created", op:">=", value:"2017-05-01T18:50:07.352550Z" },
                    { type:"simple", field:"lemma", op:"like", value:"omp" }
                ]
                }};*/
            var data = {filter:Filter};
            console.log('request data', data);
            // data = {filter:{}};
            spinnerService.show('searchLemmaSpinner'); 
            if ($scope.selectedSearchType == 'lexentry') {
                var resultPromise =  wnwbApi.LexicalEntrySearch.query(data).$promise;
            }
            else if ($scope.selectedSearchType == 'sense') {
                var resultPromise =  wnwbApi.SenseSearch.query(data).$promise;
            }
            else {
                var resultPromise =  wnwbApi.SynsetSearch.query(data).$promise;
            }
            
            //console.log('resultPromise', resultPromise);
            resultPromise.then(function(searchRes) {
                 	console.log("searchRes",searchRes);
                 	$rootScope.extSearchResult = searchRes;
                    //kui tylemus tyhi, j22 sellele lehele
                 	SearchResult = searchRes;
                    extendedSearchModalService.setSearchTitle($scope.searchTitle[$scope.selectedSearchType]);
                    extendedSearchModalService.setSearchType($scope.selectedSearchType);
                    extendedSearchModalService.setSearchResult(SearchResult);
                    $state.go('extsearch');
                    spinnerService.hide('searchLemmaSpinner');  
                    $uibModalInstance.close(null);
            });
		};

        var LexentryFieldsPromise =  extendedSearchModalService.getLexentryFilterFieldsPromise();
        var SynsetFieldsPromise = extendedSearchModalService.getSynsetFilterFieldsPromise();
        var SenseFieldsFromise = extendedSearchModalService.getSenseFilterFieldsPromise();
        var PromiseList = [SynsetFieldsPromise, SenseFieldsFromise, LexentryFieldsPromise];
       
        $q.all(PromiseList).then(function(qAllResults) {
		  $scope.init(qAllResults);
        });

	} ]);
});