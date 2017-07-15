/**
 * Created by katrin on 03.07.17.
 */

define([
    'angularAMD',
    'service/ExtendedSearchModalService'
], function (angularAMD) {

    angularAMD.controller('ExtendedSearchResultCtrl', ['$scope', '$rootScope', 'service/ExtendedSearchModalService', 'spinnerService', function ($scope, $rootScope, extendedSearchModalService, spinnerService) {

        console.log('ExtendedSearchResultCtrl');
        var searchResult = ['init'];
        $scope.currentPage = 1;
        
		$scope.init = function() {
             $scope.searchTitle = extendedSearchModalService.getSearchTitle();
             $scope.searchType = extendedSearchModalService.getSearchType(); 
             $scope.searchResult = extendedSearchModalService.getSearchResult(); 
             $scope.searchLimit = extendedSearchModalService.getSearchLimit();
		};

        $scope.changePage = function(page) {
            //console.log(page);
            spinnerService.show('extSearchResultSpinner');
            var offset = (page-1)*$scope.searchLimit;
            var resultPromise = extendedSearchModalService.getSearchResultPromise(extendedSearchModalService.getSearchType(), extendedSearchModalService.getSearchFilter(), offset, $scope.searchLimit);
            resultPromise.then(function(SearchResult) {
                extendedSearchModalService.setSearchResult(SearchResult);
                extendedSearchModalService.setSearchLimit($scope.searchLimit);
                 spinnerService.hide('extSearchResultSpinner');
            });
		};

        $scope.init();
        
        $scope.pageChanged = function() {
             $scope.changePage($scope.currentPage);
        };

        $rootScope.$on('newExtendedSearchResultChanged', function (event) {
             console.log('newExtendedSearchResultChanged broadcast');
               $scope.init();
        });
    }]);
});