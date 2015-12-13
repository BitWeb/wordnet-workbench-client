/**
 * Created by ivar on 23.11.15.
 */

define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.controller('HomeCtrl', ['$scope','$state', 'AuthService', function ($scope, $state, authService) {
        console.log('HomeController');

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