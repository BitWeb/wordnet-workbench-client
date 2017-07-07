/**
 * Created by katrin on 03.07.17.
 */

define([
    'angularAMD',
    'service/ExtendedSearchModalService'
], function (angularAMD) {

    angularAMD.controller('ExtendedSearchResultCtrl', ['$scope', 'service/ExtendedSearchModalService', function ($scope, extendedSearchModalService) {

        console.log('ExtendedSearchResultCtrl');
        var searchResult = ['init'];
        
      
        
        
		$scope.init = function() {
             
             $scope.searchTitle = extendedSearchModalService.getSearchTitle();
             $scope.searchType = extendedSearchModalService.getSearchType(); 
             $scope.searchResult = extendedSearchModalService.getSearchResult(); 
			
			
		};

        $scope.init();
    }]);
});