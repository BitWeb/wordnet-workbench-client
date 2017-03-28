/**
 * Created by ivar on 23.11.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('NewHomeCtrl', ['$scope','$state', '$stateParams', '$q', 'AuthService', 'service/LexiconService', 
                                       function ($scope, $state, $stateParams, $q, authService, lexiconService) {

    	nvls = function(v){
    		if (v) return v.toString();
    		return '0';
    	}
    	
		$scope.init = function() {
            console.debug('$stateParams',$stateParams);
			if ($stateParams.lexId)
            {
               lexiconService.setWorkingLexiconId($stateParams.lexId);
            }
			$scope.lexicon = lexiconService.getWorkingLexicon();
            console.debug('scope.lex',$scope.lexicon);
			
		};
		
		

        $scope.$on("workingLexiconChanged", function() {

            $scope.init();
        });
		
		$q.all([ lexiconService.getWorkingLexiconPromise() ]).then(function(qAllResults) {
			$scope.init();
		});
		

    }]);
});