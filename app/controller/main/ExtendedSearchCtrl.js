/**
 * Created by ivar on 1.12.15.
 */

define([
	'angularAMD',
    'service/LexiconService',
    'service/ExtendedSearchModalService'
], function(angularAMD) {

	angularAMD.controller('main/ExtendedSearchCtrl', [ '$scope', '$q', '$state', '$log', '$http', '$uibModal', '$uibModalInstance', 'wnwbApi',  'spinnerService', 'service/ExtendedSearchModalService', function($scope, $q, $state, $log, $http, $uibModal, $uibModalInstance, wnwbApi,  spinnerService, extendedSearchModalService) {

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
                var Group = {type:'bool', op: element.boolOp, exps : []};
                for (key in element.items) {
                   Group.exps.push(constructFilter(element.items[key]));
                }  
                return Group;
            } else if (element.type=='field') {
                return { type:'simple'
                        , field: element.field.field
                        , op : element.field.selectedOps
                        , value: element.field.insertedValue };
            }
        }

        $scope.doSearch = function() {
                                   
        var searchTerm = $scope.searchTerm;
        var hasSynset = null;
            
        var Filter = constructFilter($scope.filterTree[$scope.selectedSearchType]);
             
        console.debug(Filter);
        var data = {filter:
            { type:"bool", op: "and", exps: [
                { type:"simple", field:"date_created", op:">=", value:"2017-05-01T18:50:07.352550Z" },
                { type:"simple", field:"lemma", op:"like", value:"omp" }
            ]
            }};

              
            // data = {filter:{}};
              
              //LexicalEntrySearch
             /* 
              var parameter = JSON.stringify(data);
             // var parameter = data;
              var url = 'http://dev.keeleressursid.ee/' +'api/v1/'+'synsetsearch/';
              $http.post(url, parameter).
                success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                console.log(data);
              }).
              error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
              });
              
              */
              //var search = new wnwbApi.LexicalEntrySearch();
              /* response = self.client.post(url, data=data, format='json')
        if response.status_code <> 200:
            print response.data*/
              
                 //console.debug('filterTree', $scope.filterTree);
                if (0) {
                    spinnerService.show('searchLemmaSpinner');
                    var results = wnwbApi.LexicalEntry.query({
                        prefix : 'po',
                        lexid : 6
                    }, function() {
                        $scope.searchResults = [];				
                        spinnerService.hide('searchLemmaSpinner');
                    });
                }
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