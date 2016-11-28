/**
 * Created by ij on 06.09.16.
 */

define([
    'angularAMD',
    'underscore'
], function (angularAMD) {

    angularAMD.service('service/DomainService', [ '$rootScope', '$log', '$q', 'wnwbApi', 'service/LexiconService',
        function($rootScope, $log, $q, wnwbApi, lexiconService) {
            var self = this;

            $log.log('[service/DomainService] ctor');

            var domainList = null;
            var domainMapId = null;

            //

            var domainListPromise = null;
            var fDomainListPromiseResolved = false;

            this.init = function ( callback ) {
                self.load();

                if(callback) {
                    callback(true);
                }
            };

            this.load = function () {
            	domainList = null;
            	domainMapId = null;

                fDomainListPromiseResolved = false;
                domainListPromise = wnwbApi.Domain.query({lexid: lexiconService.getWorkingLexicon().id}).$promise;

                domainListPromise.then(function (result) {
                	domainList = result;
                	domainList.push({id:null, name:''});
                	domainMapId = _.object(_.map(domainList, function(item) { return [item.id, item] }));
                	fDomainListPromiseResolved = true;
                });
            };

            this.getList = function () {
                if(!domainListPromise) {
                    $log.warn('[service/DomainService] getList(): init() hasn\'t been run before.');
                    self.init();
                }
                return domainListPromise;
            };

            this.getById = function (relTypeId) {
                if(fDomainListPromiseResolved) {
                    if(domainMapId[relTypeId]) {
                        return domainMapId[relTypeId];
                    }
                } else {
                    $log.warn('[service/DomainService] getById(): domainListPromise isn\'t resolved');
                }
                return null;
            };
        }
    ]);
});