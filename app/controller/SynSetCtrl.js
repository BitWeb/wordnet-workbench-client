define([
    'angularAMD',
], function (angularAMD) {

    angularAMD.controller('SynSetCtrl', ['$scope', '$state', '$stateParams', 'wnwbApi', function ($scope, $state, $stateParams, wnwbApi) {
        console.log('SynSet Controller');

        var synSet = wnwbApi.SynSet.get({ id: $stateParams.id }, function () {
            console.log(synSet);
            $scope.synSet = synSet;
        });

        console.log(synSet);


    }]);
});