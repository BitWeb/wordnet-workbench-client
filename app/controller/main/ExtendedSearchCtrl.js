/**
 * Created by ivar on 1.12.15.
 */

define([
	'angularAMD',
    'service/LexiconService',
    'service/ExtendedSearchModalService'
], function(angularAMD) {

	angularAMD.controller('main/ExtendedSearchCtrl', [ '$scope', '$q', '$state', '$log', '$uibModal', '$uibModalInstance', 'wnwbApi',  'spinnerService', 'service/ExtendedSearchModalService', function($scope, $q, $state, $log, $uibModal, $uibModalInstance, wnwbApi,  spinnerService, extendedSearchModalService) {

		$log.log('main/ExternalSearchCtrl');
        

        
        var SearchTypes = {
                synset      : 'Synset', 
                lexentry    : 'Lexentry',
                sense      : 'Sense'
        
        };

     
        var Fields = {
                synset : {},
                sense : {},
                lexentry : {}
            }
       
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
         
        
            $scope.fieldsArrayToDict = function(array)
            {
                var fieldsDict = {};
                for (el in array)
                {
                    if (array[el].values && array[el].values!='*')
                    {
                       var fixedValues =  (array[el].values).split(',');
                        array[el].fixedValues = fixedValues;
                    }
                   fieldsDict[array[el].field] =  array[el];
                   
                }
                console.debug('fieldsDict', fieldsDict);
                return fieldsDict;
            }
            $scope.filterRows = [];
            $scope.filterRows.common = [];
            $scope.filterRows.synset = [];
            $scope.filterRows.sense = [];
            $scope.filterRows.lexentry = [];
         
            $scope.init = function (qAllResults) {
                
                $scope.Fields = Fields;
                $scope.Fields.synset = $scope.fieldsArrayToDict(qAllResults[0]); 
                $scope.Fields.sense = $scope.fieldsArrayToDict(qAllResults[1]); 
                $scope.Fields.lexentry = $scope.fieldsArrayToDict(qAllResults[2]); 
                console.log($scope.Fields);
                $scope.TypeValidation = Types;
                $scope.searchTypes = SearchTypes;
               // $scope.availableFields = Fields;
                
                if (extendedSearchModalService.getSearchFilterRows()!==false) {
                    console.log('here');
                    $scope.filterRows = extendedSearchModalService.getSearchFilterRows();
                    $scope.selectedSearchType = extendedSearchModalService.getSearchType();
                } else {
                    $scope.resetAllFilterRows(); 
                }
              
                $scope.resetAllFilterRows(); 
                if (!$scope.selectedSearchType) {
                   $scope.selectedSearchType = 'synset'; 
                }

            };
        
          
        
        
        
        $scope.changeSearchType = function(key) {
            
             $scope.selectedSearchType = key;
            console.log('selectedTypechanged');
   
        }
            
         $scope.resetFilterRows = function(key) {
            $scope.filterRows[key] = []; 
             for (var fieldid in Fields[key]){
                if (fieldid == 'lexid' || fieldid == 'creator')
                {
                    var newField = angular.copy(Fields[key][fieldid]);
                    if (newField.ops.length==1){
                        newField.selectedOps = newField.ops[0];

                    }
                  $scope.filterRows[key].push(newField);   
                }
            } 
        }
        
        
        $scope.resetAllFilterRows = function() {
                $scope.resetFilterRows('common');
                $scope.resetFilterRows('synset');
                $scope.resetFilterRows('sense');
                $scope.resetFilterRows('lexentry');
                extendedSearchModalService.saveSearchFilterRows($scope.filterRows);
                extendedSearchModalService.saveSearchType($scope.selectedSearchType);
        }
          

          $scope.cancel = function() {
              $uibModalInstance.close(null);
          }
		
          
          $scope.evaluateAllFields = function() 
          {
              
              
              
          }
        
        
          
          
		  $scope.doSearch = function() {
              
                extendedSearchModalService.saveSearchFilterRows($scope.filterRows);
                extendedSearchModalService.saveSearchType($scope.selectedSearchType);
                                           
                var searchTerm = $scope.searchTerm;
                var hasSynset = null;
                 console.debug('filterRows', $scope.filterRows);
                if (1) {
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