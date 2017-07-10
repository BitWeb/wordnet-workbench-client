/**
 * Created by katrin on 03.07.17.
 */

define([
    'angularAMD',
    'service/ExtendedSearchModalService'
], function (angularAMD) {

    angularAMD.controller('ExtendedSearchResultCtrl', ['$scope', '$rootScope', 'service/ExtendedSearchModalService', function ($scope, $rootScope, extendedSearchModalService) {

        console.log('ExtendedSearchResultCtrl');
        var searchResult = ['init'];
        
      
        
        
		$scope.init = function() {
             
             $scope.searchTitle = extendedSearchModalService.getSearchTitle();
             $scope.searchType = extendedSearchModalService.getSearchType(); 
             $scope.searchResult = extendedSearchModalService.getSearchResult(); 
			
			
		};

        $scope.init();
        
        
         $rootScope.$on('newExtendedSearchResultChanged', function (event) {
             console.log('newExtendedSearchResultChanged broadcast');
               $scope.init();
        });
    }]);
});