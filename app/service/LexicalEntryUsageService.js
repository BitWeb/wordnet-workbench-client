/**
 * Created by katrin on 04.04.17.
 */

define(['appModule'], function (app) {

    app.service('service/LexicalEntryUsageService', [  'wnwbApi', function( wnwbApi) {
        var self = this;
        
        console.log('[service/LexicalEntryUsageService.js]');

        this.getLexicalEntryUsagePromise = function (wordString, lexId=null) {
            var Params = {};
            Params.word =  wordString;                                   
            if (lexId) {
               Params.lexid =  lexId;                                    
            }         
            return wnwbApi.LexicalEntryUsage.query(Params).$promise;
        };   
                       
        this.makeLexicalEntryUsageListForDirectiveLexUsage = function (data) { 
            if (!data.length) {
                return [ { id : 0, text : 'NOT IN USE' } ]; 
            } else {
               return  data; 
            }
        };
    }]);
});