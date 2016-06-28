/**
 * Created by Ivar on 13.12.2015.
 */

define(['appModule'], function (app) {

    app.service('AuthService', [ '$http','$state','config','$location','$rootScope','$timeout','$log','$window', '$sessionStorage', '$localStorage', 'wnwbApi',
        function($http, $state, config, $location, $rootScope, $timeout, $log, $window, $sessionStorage, $localStorage, wnwbApi) {
            var self = this;

            var storage = $localStorage;

            var user = null;
            var isAuthenticated = false;

            this.init = function ( callback ) {
                var token = self.getToken();
                $log.debug('[AuthService::init()] Token: ', token);
                if(token) {
                    self.setupHttpHeader( token );
                }
                self._requestUserInfo( callback );
                return;
            };

            this._requestUserInfo = function ( callback ) {

                if(!self.getToken()){
                    $log.debug('Has no user token.');
                    callback();
                    return;
                }

                self.updateUserInfo(self.getToken());
                callback();

                /*$http.get( config.API_URL + '/user').then(function ( response ) {
                    self.updateUserInfo(response.data);
                    callback();
                }, function ( response ) {
                    self.updateUserInfo(response.data);
                    callback();
                });*/
            };

            this.isAuthenticated = function () {
                return isAuthenticated;
            };

            this.signOut = function () {
                $log.log('singOut');
                //$state.go('auth');
                user = null;
                self.removeToken();
                isAuthenticated = false;
                $rootScope.principal = null;
                $rootScope.$broadcast('notAuthenticated', $state);

                /*$http.get(config.API_URL + '/user/logout').
                    then(function(response) {
                        $state.go('auth');
                        user = null;
                        self.removeToken();
                        isAuthenticated = false;
                        $rootScope.user = null;
                        $rootScope.$broadcast('notAuthenticated', $state);
                    }, function(response) {
                        console.error(response);
                    });*/
                return true;
            };

            this.startAuth = function (username, password, callback) {

                var landingPath = self.getLandingPath() ? self.getLandingPath() : '/';
                var returnPath = $location.protocol() + '://' + location.host +'/#'+ landingPath;
                var returnPathEncoded =  encodeURIComponent(returnPath);

                $http.defaults.headers.common['Authorization'] = 'Basic ' + btoa(username + ':' + password);

                var auth = new wnwbApi.Authorization();
                auth.$auth(function () {
                    $http.defaults.headers.common['Authorization'] = 'Token ' + auth.token;
                    //$sessionStorage.token = {token: auth.token, timeCreated: new Date()};
                    storage.token = {token: auth.token, timeCreated: new Date()};

                    isAuthenticated = true;

                    self.updateUserInfo(storage.token);
                    callback({success: true});

                    $rootScope.$broadcast('authenticationFinished', $state);
                }, function () {
                    callback({success: false});
                });
            };

            this.logout = function () {
                storage.token = null;
                $state.go('home', {}, {reload: true});
            };

            this.updateUserInfo = function (token) {
                $log.debug('Update user info ', token);

                if (!token || new Date() - new Date(token.timeCreated) >= 28800000) {
                    self.signOut();
                } else {
                    isAuthenticated = true;
                    //user = {username: 'test'};
                    var principal = wnwbApi.Principal.query(function (result) {
                    	if (result.length > 0) {
                    		$rootScope.principal = result.shift();
                    	}
                    });
                    //$rootScope.user = user;
                    $rootScope.$broadcast('authenticated', $state);
                    //self.doHeardBeat();
                }
            };

            /*this.updateUserInfo = function (userData) {

                $log.debug('Update user info ', userData);

                if(userData.statusCode != 200){
                    self.signOut();
                } else {
                    isAuthenticated = true;
                    user = userData.data;
                    $rootScope.user = user;
                    self.doHeardBeat();
                }
            };*/

            this.setToken = function (token) {
                self.setupHttpHeader(token);
                //return $sessionStorage.token = token;
                return storage.token = token;
            };

            this.getToken = function(){
                //return $sessionStorage.token;
                return storage.token;
            };

            this.removeToken = function () {
                //delete $sessionStorage.token;
                delete storage.token;
            };

            this.getLandingPath = function () {
                return window.sessionStorage.getItem('landingPath');
            };
            this.setLandingPath = function (landingPath) {

                if(landingPath == '/auth' || landingPath == '/err404'){
                    landingPath = '/home'
                }

                return  window.sessionStorage.setItem('landingPath', landingPath);
            };

            this.setupHttpHeader = function(token) {
                $http.defaults.headers.common['Authorization'] = 'Token ' + token.token;
            };

            this.getUser = function(id, callback) {
                $http.get(config.API_URL + '/user/' + id + '/details').then(function(response) {
                    callback(null, response.data.data);
                });
            };

            this.getUsersList = function (pagination, callback) {

                pagination = pagination  || {};

                $http.get(config.API_URL + '/user/list', {params: pagination}).then(function (response) {
                    callback(null, response.data.data);
                });
            };

            this.updateUser = function(user, callback) {
                var userData = {
                    role: user.role,
                    discMax: user.discMax,
                    isActive: user.is_active
                };
                $http.put(config.API_URL + '/user/' + user.id + '/details', userData).then(function(response) {
                    callback(response.errors, response.data);
                });
            };

            var timeoutPromise = null;

            this.doHeardBeat = function () {

                if(!self.isAuthenticated){
                    return;
                }

                if(timeoutPromise){
                    $timeout.cancel(timeoutPromise);
                }

                $http.put(config.API_URL + '/user/heart-beat', {}).then(function(response) {
                    $rootScope.notificationsSummary = response.data.data;
                    if(!config.hearbeat_interval){
                        return
                    }
                    timeoutPromise = $timeout(function () {

                        if(!self.isAuthenticated){
                            return;
                        }
                        self.doHeardBeat();

                    }, config.hearbeat_interval);

                }, function(response) {
                    $log.error(response);
                });

            };
        }
    ]);
});