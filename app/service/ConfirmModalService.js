define([
    'angularAMD',
    'controller/main/ConfirmModalCtrl'
], function (angularAMD) {

    angularAMD.service('service/ConfirmModalService', [ '$rootScope', '$log', '$q', '$uibModal', 'wnwbApi',
        function($rootScope, $log, $q, $uibModal, wnwbApi) {
            var self = this;

            this.init = function ( callback ) {
                self.load();

                if(callback) {
                    callback(true);
                }
            };

            this.load = function () {

            };

            this.open = function (data) {
                data = angular.extend({}, {
                    text: 'Are you sure?',
                    title: 'Confirm',
                    ok: 'OK',
                    cancel: 'Cancel'
                }, data || {});

                return $uibModal.open({
                    templateUrl: 'view/main/confirmModal.html',
                    controller: 'main/ConfirmModalCtrl',
                    resolve: {
                        data: function () {
                            return data;
                        }
                    }
                }).result;
            };
        }
    ]);
});