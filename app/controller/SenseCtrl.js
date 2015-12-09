/**
 * Created by ivar on 23.11.15.
 */
define([
    'angularAMD'/*,
    'SynSetService',
     'WorkflowDefinitionService',
     'WorkflowAddDefinitionModalController',
     'WorkflowAddModalController'*/
], function (angularAMD) {

    angularAMD.controller('SenseCtrl', ['$scope','$state', '$stateParams', 'wnwbApi', function ($scope, $state, $stateParams, wnwbApi) {
        console.log('SenseController');

        var senseId = 0;
        if($stateParams.id) {
            senseId = $stateParams.id;
        }

        if(senseId) {
            var sense = wnwbApi.Sense.get({id: senseId}, function () {
                $scope.sense = sense;

                console.log('Sense: ');
                console.log(sense);

                //TODO: parse relations

                //TODO: parse ext refs

                /*var test = _
                 .chain(synSet.relations)
                 .groupBy('rel_type')
                 .map(function(value, key) {
                 return {
                 rel_type: key,
                 relations: _.pluck(value, 'id')
                 }
                 })
                 .value();

                 console.debug(synSet.relations);*/
            });
        } else {
            $scope.sense = new wnwbApi.Sense();
        }

        var domains = wnwbApi.Domain.query(function () {
            $scope.domains = domains;
        });

        /*$scope.synSets = projectService.getList({}, function (a, b) {
         console.log('my callback');
         console.debug(a);
         console.debug(b);

         $scope.synSets = projectService.getProject(b[0].id, function (a, b) {
         console.log('my callback get project');
         console.debug(a);
         console.debug(b);
         });
         });*/


        /*if(!userService.isAuthenticated()){
         $state.go('auth');
         return;
         }

         projectService.getHomeProject( function (err, project) {
         if(err){
         console.error(err);
         return alert('Err');
         }

         if(!project){
         return;
         }


         $scope.project = project;
         $scope.projectId = project.id;

         projectService.getProjectWorkflows($scope.projectId, function (err, workflows) {
         if(err){
         console.error(err);
         return alert('Err');
         }
         $scope.workflows = workflows;
         });
         });

         $scope.openDefineWorkflowModal = function () {
         workflowDefinitionService.openAddDefinitionModal($scope, $scope.project);
         };

         $scope.openAddWorkflowModal = function () {
         workflowDefinitionService.openAddWorkflowModal($scope, $scope.project);
         };*/

    }]);
});