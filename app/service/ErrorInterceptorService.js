define(['appModule'], function (appModule) {

    appModule.factory('ErrorInterceptorService', [ '$q', '$log', '$rootScope',
        function( $q, $log, $rootScope ) {
            var self = this;
            return {
                'responseError': function(rejection) {
                    console.error('Error response', rejection);

                    $rootScope.addError( rejection );

                    return $q.reject(rejection);
                }
            };

        }
    ]);
});