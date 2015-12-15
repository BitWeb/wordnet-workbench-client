/**
 * Created by ivar on 23.11.15.
 */
define([
    'angularAMD',
    'angular-animate'/*,
    'directives'/*,
    'SynSetService',
     'WorkflowDefinitionService',
     'WorkflowAddDefinitionModalController',
     'WorkflowAddModalController'*/
], function (angularAMD) {

    angularAMD.controller('SenseCtrl', ['$scope','$state', '$stateParams', 'wnwbApi', '$animate', function ($scope, $state, $stateParams, wnwbApi, $animate) {
        console.log('SenseController');

        var senseId = 0;
        if($stateParams.id) {
            senseId = $stateParams.id;
        }

        $scope.fShowDefinition = false;

        //var sense = {};
        //sense.sense_definitions = [];
        //sense.sense_definitions.push({id: 1, text: 'text', language: 'language', source: 'source'});
        $scope.sense = sense;
        if(senseId) {
            var sense = wnwbApi.Sense.get({id: senseId}, function () {
                $scope.sense = sense;

                console.log('Sense: ');
                console.log(sense);

                //TODO: parse relations

                //TODO: parse ext refs
            });
        } else {
            $scope.sense = new wnwbApi.Sense();
            $scope.sense.lexical_entry = {lexicon: $scope.$storage.currentLexicon.id, part_of_speech: 'n', lemma: ''};
            $scope.sense.status = 'D';
            $scope.sense.nr = 1;
            $scope.sense.sense_definitions = [];
            $scope.sense.examples = [];
            $scope.sense.relations = [];
            $scope.sense.sense_externals = [];
        }

        var domains = wnwbApi.Domain.query(function () {
            $scope.domains = domains;
        });

        $scope.saveDefinition = function () {
            $state.go('sense', {id: $scope.sense.id});
        };

        $scope.selectedDefinition = null;
        $scope.selectDefinition = function (def) {
            $scope.selectedDefinition = def;
            $state.go('sense.def', {id: $scope.sense.id});
        };

        $scope.deleteDefinition = function (definition) {

        };

        $scope.addDefinition = function () {
            //$scope.selectedDefinition = null;
            console.log('add definition');
            $state.go('sense.def', {id: $scope.sense.id});
            $scope.selectedDefinition = {statements: []};
        };

        $scope.addStatement = function () {
            //push row
            $scope.selectedDefinition.statements.push({
                text: 'test text',
                source: 'test source'
            });
        };

        $scope.editStatement = function (statement) {
            $scope.selectedStatement = statement;
        };

        $scope.discardDefinition = function () {

        };

        $scope.addExample = function () {
            $scope.sense.examples.push({
                text: 'test text',
                language: '',
                source: 'test source'
            });
        };

        $scope.editExample = function (example) {
            $scope.selectedExample = example;
        };

        $scope.deleteExample = function (example) {

        };

        $scope.addRelation = function () {

        };

        $scope.showRelation = function () {

        };

        $scope.addRelation = function () {

        };

        $scope.showRelation = function () {

        };

        $scope.addExtRef = function () {

        };

        $scope.selectExtRef = function () {

        };

        $scope.showDefinition = function () {
            console.log('show definition');
            $scope.secondaryView = 'definition';
            //$scope.fShowDefinition = true;
            //$scope.fShowRelation = false;
        };

        $scope.showRelation = function () {
            $scope.secondaryView = 'relation';
            //$scope.fShowDefinition = false;
            //$scope.fShowRelation = true;
        };

        $scope.saveSense = function () {
            console.log('save sense');
            if($scope.sense.id) {
                $scope.sense.$update({id: $scope.sense.id});
            } else {
                $scope.sense.$save();
            }
        };

        $scope.discardSenseChanges = function () {

        };

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