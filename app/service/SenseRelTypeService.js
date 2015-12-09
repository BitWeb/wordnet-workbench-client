/**
 * Created by ivar on 30.11.15.
 */

define(['angularAMD', 'ui-bootstrap'], function (angularAMD) {

    angularAMD.service('SenseRelTypeService', [ '$http', 'config', '$modal','$log', '$resource',
        function( $http, config, $modal, $log, $resource ) {
            console.log('SenseRelTypeService');

            //$http.defaults.xsrfCookieName = 'csrftoken';
            //$http.defaults.xsrfHeaderName = 'X-CSRFToken';

            var self = this;
            var API_PATH = '/sensereltype/';

            this.getList = function (params, callback ) {
                console.log('SenseRelTypeService::getList');
                $http.get(config.API_URL + API_PATH, {params: params }).then(
                    function(data) {
                        console.log(data);
                        console.log(data.data);
                        callback(data.data);
                    }
                );

                /*var newSenseRelType = {
                    'name': 'has_testtype3',
                    'description' : 'description',
                    'direction' : 'd'
                };
                self.createSenseRelType(newSenseRelType, function (varNull, data) {

                });*/
            };

            /*this.getHomeProject = function ( callback ) {

                var params = {
                    sort: 'updated_at',
                    order: 'DESC',
                    page: 1,
                    perPage: 1
                };

                self.getList(params, function (err, data) {
                    if(err){
                        return callback(err);
                    }
                    return callback(null, data.rows[0]);
                });
            };*/

            this.deleteSenseRelType = function(senseRelType, callback){

                //delete test
                /*$http.delete(config.API_URL + '/sensereltype/19/').then(
                 function(data) {
                 console.log(data);
                 console.log(data.data);
                 callback(data.data);
                 }
                 );*/

                $http.delete(config.API_URL + API_PATH + senseRelType.id).then(
                    function(data, status) {
                        console.log(data.data);
                        callback(null, true);
                    }
                );
            };

            this.openDeleteModal = function ($scope, project) {

                /*return $modal.open({
                 templateUrl: '../../views/project/confirm_delete_modal.html',
                 scope: $scope,
                 controller: 'ProjectDeleteController',
                 resolve: {
                 project: function(){
                 return project;
                 }
                 }
                 });*/
            };


            this.createSenseRelType = function (senseRelType, callback) {
                /*$http.post(config.API_URL + API_PATH, senseRelType).then(
                    function(data, status) {
                        console.log(data.data);
                        callback(null, data.data.data);
                    }
                );*/
            };

            this.updateSenseRelType = function (senseRelType, callback) {

                /*$http.post(config.API_URL + API_PATH, senseRelType).then(
                    function(data, status) {
                        console.log(data.data);
                        callback(null, data.data.data);
                    }
                );*/
            };

            this.getSenseRelType = function (id, callback) {

                $http.get(config.API_URL + API_PATH + id).then(
                    function(data) {
                        console.log(data);
                        callback(null, data.data);
                    }
                );
            };

            /*this.getProjectWorkflows = function (id, callback) {

                $http.get(config.API_URL + '/project/' + id + '/workflows').then(
                    function(data) {
                        console.log(data);
                        callback(null, data.data.data);
                    }
                );
            };*/

            /*this.addResourcesToProject = function( projectId, resourcesIds, callback) {
                var data = {
                    resources: resourcesIds
                };

                $http.put(config.API_URL + '/project/' + projectId + '/add-resources', data).then(
                    function(data) {
                        callback(null, data.data.data);
                    }
                );
            };*/
            /*this.addEntuResourcesToProject = function( projectId, fileIds, callback) {
                var data = {
                    files: fileIds
                };
                $http.put(config.API_URL + '/project/' + projectId + '/add-entu-files', data).then(
                    function(data) {
                        callback(null, data.data.data);
                    },
                    function(err) {
                        callback(err);
                    }
                );
            };*/


        }
    ]);
});