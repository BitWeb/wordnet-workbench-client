/**
 * Created by ivar on 1.12.15.
 */

define([
	'angularAMD',
    'service/LexiconService'
], function(angularAMD) {

	angularAMD.controller('main/ExtendedSearchCtrl', [ '$scope', '$state', '$log', '$uibModal', '$uibModalInstance', 'wnwbApi',  'spinnerService', function($scope, $state, $log, $uibModal, $uibModalInstance, wnwbApi,  spinnerService) {

		$log.log('main/ExternalSearchCtrl');

	   var Fields = 
                {
                    'lexid' : { 
                                type : 'Int'
                                , 'operators' : [ '=' ] 
                                , default : 1
                                , id : 'lexid'
                        },
                    'creator' : { 
                                type : 'Char'
                                , 'operators' : [ '=', 'like', 'isempty' ] 
                            , default : 1
                            , id : 'creator'
                        },
                    'date_created' : { 
                                type : 'DateTime'
                                , 'operators' : [ '=', '<>', '>', '>=', '<', '<=', 'isempty' ] 
                            , default : 0
                        , id : 'date_created'
                    
                        }
                
                }
         
            $scope.Fields = Fields;
            $scope.availableFields = Fields;
            this.init = function (){
                
                $scope.filterFields = [];
                //siin kontrollime ka storage infot ja salvestatud filtri valiku
                for (var key in Fields){
                    if (Fields[key].default == 1)
                    {
                      $scope.filterFields.push(Fields[key]);   
                    }
                }
            };
        
          $scope.addFilterRow = function(key) {
             $scope.filterFields.splice(key+1, 0, {});
             
          }
             
         $scope.removeFilterRow = function(key) {
             $scope.filterFields.splice(key, 1);
             
          }
         
         $scope.selectedFilterChanged= function (key, id){
             console.log($scope.filterFields);
           
         }
          $scope.cancel = function() {
              $uibModalInstance.close(null);
          }
		
		  $scope.doSearch = function() {
            
                                         
			var searchTerm = $scope.searchTerm;
			var hasSynset = null;
              $log.log('main/LexicalEntry.query (prefix: ');
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

		this.init();

	} ]);
});