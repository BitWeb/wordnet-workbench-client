define([
	'angularAMD',
	'service/LexiconService'
], function(angularAMD) {

	angularAMD.controller('main/NavigationCtrl', [ '$scope', '$rootScope', '$state', '$stateParams', '$log', 'wnwbApi', 'service/LexiconService', 'AuthService', function($scope, $rootScope, $state, $stateParams, $log, wnwbApi, lexiconService, authService) {

		$scope.workingLexicon = lexiconService.getWorkingLexicon();

		$scope.lexicons = lexiconService.getLexicons();
		$scope.lexicons.then(function(lexicons) {
			$scope.lexicons = lexicons;
		});

		$scope.setWorkingLexicon = function(lexicon) {
			lexiconService.setWorkingLexicon(lexicon);
			$rootScope.$broadcast('workingLexiconChangedByUser', lexicon, $state.current);
		};

		$scope.logout = function() {
			authService.signOut();
			$state.go('home', {}, {
				reload : true
			});
		};

		$scope.toggleView = function() {
			if ($scope.state.name.indexOf('_edit')<0) {
				if ($scope.state.name == 'home') {
					$rootScope.goToTop();
				} else {
					$state.go('home', {}, {
						reload : true
					});
				}
			}
		};

		$scope.$on('workingLexiconChangedByUser', function(event, lexicon, state) {
			$scope.workingLexicon = lexicon;
			$rootScope.language = lexicon.language;
			$scope.language = $rootScope.language;
		});
        

		$scope.$on('LexiconService.workingLexiconChange', function(event, newWorkingLexicon) {
			$scope.workingLexicon = newWorkingLexicon;
			$rootScope.language = newWorkingLexicon.language;
			$scope.language = $rootScope.language;
		});
        
        $scope.$on('workingLexiconChangedStayStill', function(event, lexicon, state) {
            console.debug('[NavigationCtrl.js] workingLexiconChangedByUserStayStill');
			$scope.workingLexicon = lexicon;
			$rootScope.language = lexicon.language;
			$scope.language = $rootScope.language;
		});


	} ]);
});