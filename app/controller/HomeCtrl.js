/**
 * Created by ivar on 23.11.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('HomeCtrl', ['$scope','$state', '$q', 'AuthService', 'service/LexiconService', 'service/StatsService', 'spinnerService', 
                                       function ($scope, $state, $q, authService, lexiconService, statsService, spinnerService) {

    	nvls = function(v){
    		if (v) return v.toString();
    		return '0';
    	}
    	
		$scope.init = function() {
			spinnerService.show('statsSpinner');
			var lexicon = lexiconService.getWorkingLexicon();
			var stats = {}

			if (lexicon != null) {
				statsService.load(lexicon.id);
				statsService.getList().then( function(data) {
					stats.totals = [];
					stats.users = [];
					stats.values = [];
					stats.months = [];
					for(var i = 0; i < data.length; i++) {
						if (data[i].attr == 'TOTAL') {
							if (data[i].obj == 'SYNSET') stats.totals.push({name:'Synsets', value:data[i].val});
							else if (data[i].obj == 'SENSE') stats.totals.push({name:'Senses', value:data[i].val});
							else if (data[i].obj == 'RELATION') stats.totals.push({name:'Relations', value:data[i].val});
						} else {
							var b_exists = false;
							var name = data[i].attr;
							if (name == null) name = '';
							for(var u = 0; u < stats.users.length; u++) {
								if (name == stats.users[u]) {
									b_exists = true;
									break;
								}
							}
							if (!b_exists) {
								stats.users.push(name);
								stats.values.push([]);
							}
							b_exists = false;
							if (data[i].attr3 !== null) {
								for(var m = 0; m < stats.months.length; m++) {
									if (data[i].attr3 == stats.months[m]) {
										b_exists = true;
										break;
									}
								}
								if (!b_exists) {
									stats.months.push(data[i].attr3);
								}
							}
						}
					}
					stats.months.sort();
					stats.months.unshift('ALL');
					for(var u = 0; u < stats.users.length; u++) {
						for(var m = 0; m < stats.months.length; m++) {
							stats.values[u][m] = {synset_c:'0', synset_u:'0', rel_c:'0', rel_u:'0', sense_c:'0', sense_u:'0'};
						}
					}
					for(var u = 0; u < stats.users.length; u++) {
						for(var m = 0; m < stats.months.length; m++) {
							for(var i = 0; i < data.length; i++) {
								if (data[i].attr === stats.users[u] && (data[i].attr3 == stats.months[m] || (data[i].attr3 == null && m == 0))) {
									if (data[i].obj == 'SYNSET' && data[i].attr2 == 'created') stats.values[u][m].synset_c = nvls(data[i].val);
									else if (data[i].obj == 'SYNSET' && data[i].attr2 == 'updated') stats.values[u][m].synset_u = nvls(data[i].val);
									else if (data[i].obj == 'SENSE' && data[i].attr2 == 'created') stats.values[u][m].sense_c = nvls(data[i].val);
									else if (data[i].obj == 'SENSE' && data[i].attr2 == 'updated') stats.values[u][m].sense_u = nvls(data[i].val);
									else if (data[i].obj == 'RELATION' && data[i].attr2 == 'created') stats.values[u][m].rel_c = nvls(data[i].val);
									else if (data[i].obj == 'RELATION' && data[i].attr2 == 'updated') stats.values[u][m].rel_u = nvls(data[i].val);
								}
							}
						}
					}
					stats.data = []
					for(var u = 0; u < stats.users.length; u++) {
						for(var m = 0; m < stats.months.length; m++) {
							var isVisible = 'Y';
							if (m > 0 && m < stats.months.length-1) isVisible = 'N';
							stats.data.push(
								{	user:stats.users[u], 
									period:stats.months[m], 
									synset:stats.values[u][m].synset_c + ' / ' + stats.values[u][m].synset_u,
									rel:stats.values[u][m].rel_c + ' / ' + stats.values[u][m].rel_u,
									sense:stats.values[u][m].sense_c + ' / ' + stats.values[u][m].sense_u,
									visible:isVisible
								});
						}
					}
					
					stats.header = ['User', 'Period', 'Synsets', 'Relations', 'Senses'];
					$scope.stats = stats;
					spinnerService.hide('statsSpinner');
				});
			} else {
				spinnerService.hide('statsSpinner');
			}
		};
		
		$scope.toggle = function(user) {
			for(var i = 0; i < $scope.stats.data.length; i++) {
				if ($scope.stats.data[i].user === user && $scope.stats.data[i].period !== 'ALL' && $scope.stats.data[i].period !== $scope.stats.months[$scope.stats.months.length-1]) {
					if ($scope.stats.data[i].visible == 'Y') $scope.stats.data[i].visible = 'N';
					else $scope.stats.data[i].visible = 'Y';
				}
			}
		}

        $scope.$on("workingLexiconChanged", function() {
            console.log('reloading statistics');
            $scope.init();
        });
		
		$q.all([ lexiconService.getWorkingLexiconPromise() ]).then(function(qAllResults) {
			$scope.init();
		});
		

    }]);
});