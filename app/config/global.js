define([], function () {

    /*return {
        API_ROOT_URL: 'http://dev.keeleressursid.ee/',
        API_AUTH_URL: 'http://dev.keeleressursid.ee/'+'api-auth/',
        API_URL: 'http://dev.keeleressursid.ee/' + 'api/v1/',
        //API_URL: 'http://dev.keeleressursid.ee/api/v1',//http://localhost:8000/api/v1', //API_URL : 'http://dev.bitweb.ee:3000/api/v1',

        user : {
            roles: ['regular', 'admin']
        },
        project: {
            userRoles: ['editor', 'viewer']
        },
        resource_type: {
            split_types: ['NONE', 'LINE']
        },
        workflow_statuses: ['INIT', 'RUNNING', 'FINISHED', 'ERROR', 'CANCELLED'],
        hearbeat_interval: 3600
    };*/

    var config = {};

    config.API_ROOT_URL = 'http://dev.keeleressursid.ee/';
    config.API_AUTH_URL = config.API_ROOT_URL+'api/auth/login/';
    config.API_URL = config.API_ROOT_URL + 'api/v1/';

    config.user = {
        roles: ['regular', 'admin']
    };

    config.project = {
        userRoles: ['editor', 'viewer']
    };

    config.resource_type = {
        split_types: ['NONE', 'LINE']
    };
    config.workflow_statuses = ['INIT', 'RUNNING', 'FINISHED', 'ERROR', 'CANCELLED'];
    config.hearbeat_interval = 3600;

    console.log('API_URL: '+ config.API_URL);
    return config;

});