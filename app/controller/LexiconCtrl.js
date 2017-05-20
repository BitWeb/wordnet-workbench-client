/**
 * Created by katrin on 21.03.17.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('LexiconCtrl', ['$scope','$state', '$stateParams', '$q', 'service/LexiconService', 
                                       function ($scope, $state, $stateParams, $q, lexiconService) {

    	
    	console.debug('$stateParams', $stateParams);
        if ($stateParams.lexId){
            lexiconService.setWorkingLexiconIdStayStill($stateParams.lexId);
        }
        else{
             lexiconService.setWorkingLexiconId(null);                                   
        }
            
		$scope.init = function() {
			
            $scope.lexicon =  lexiconService.getWorkingLexicon(); 
            console.log('LexiconCtrl init scope', $scope);
		
		};
		
		

       
		$q.all([ lexiconService.getWorkingLexiconPromise() ]).then(function(qAllResults) {
			$scope.init();
		});
		
                                            
    }]);
});