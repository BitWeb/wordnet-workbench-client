define([], function() {
	var config = {};

	config.version = '0.2.0';

	config.API_ROOT_URL = 'http://dev.keeleressursid.ee/';
	config.API_AUTH_URL = config.API_ROOT_URL + 'api/auth/login/';
	config.API_URL = config.API_ROOT_URL + 'api/v1/';

	config.user = {
		roles : [ 'regular', 'admin' ]
	};

	config.project = {
		userRoles : [ 'editor', 'viewer' ]
	};

	config.resource_type = {
		split_types : [ 'NONE', 'LINE' ]
	};
	config.workflow_statuses = [ 'INIT', 'RUNNING', 'FINISHED', 'ERROR',
			'CANCELLED' ];
	config.hearbeat_interval = 3600;

	return config;

});