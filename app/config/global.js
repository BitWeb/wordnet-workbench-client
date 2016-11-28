define([], function () {
    var config = {};

    config.version = 'TBD';

    config.API_ROOT_URL = 'http://dev.keeleressursid.ee/';
    config.API_AUTH_URL = config.API_ROOT_URL+'api/auth/login/';
    config.API_UNAUTH_URL = config.API_ROOT_URL+'api/auth/logout/';
    config.API_URL = config.API_ROOT_URL + 'api/v1/';

    config.user = {
        roles: ['regular', 'admin']
    };

    config.hearbeat_interval = 3600;

    return config;

});
