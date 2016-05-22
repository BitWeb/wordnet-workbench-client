define([
    'angularAMD'
], function (angularAMD) {

    angularAMD.service('service/DirtyStateService', [ '$rootScope', '$log', '$q', '$state', '$uibModal',
        function($rootScope, $log, $q, $state, $uibModal) {
            var self = this;

            this.handlerTree = {};

            this.init = function ( callback ) {
                self.load();

                if(callback) {
                    callback(true);
                }
            };

            this.load = function () {

            };

            this.bindHandler = function(stateName, handler) {
                if(stateName) {
                    var stateParts = stateName.split('.');
                    var obj = self.handlerTree;
                    for(var i = 0;i < stateParts.length;i++) {
                        var part = stateParts[i];
                        if(obj[part] == undefined) {
                            obj[part] = {handlers: [], children: {}};
                        }
                        if(i == stateParts.length - 1) {
                            obj[part].handlers.push(handler);
                        }
                        obj = obj[part].children;
                    }
                    return function () {
                        var stateParts = stateName.split('.');
                        for(var i = 0;i < stateParts.length;i++) {
                            var part = stateParts[i];
                            if(!obj[part]) {
                                break;
                            }
                            if(i == stateParts.length - 1) {
                                var fBreak = false;
                                for(var j = 0;j < obj[part].handlers.length;j++) {
                                    if(obj[part].handlers[j] == handler) {
                                        obj[part].handlers.splice(j, 1);
                                        fBreak = true;
                                        break;
                                    }
                                }
                                if(fBreak) break;
                            }
                            obj = obj[part].children;
                        }
                    };
                }
            };

            var bindFunc = function () {
                var unbind = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
                    var handlerStack = [];
                    var relativeParts = [];
                    var testParts = [];
                    var currentParts = [];
                    var toParts = [];
                    if(toState) toParts = toState.name.split('.');
                    for(var i = 0;i < toParts.length;i++) {
                        testParts.push(toParts[i]);
                        var testName = testParts.join('.');
                        if($state.includes(testName, toParams)) {
                            relativeParts.push(toParts[i]);
                        }
                    }
                    if(options && options.reload) {
                        var reloadName = '';
                        if(options.reload === true) {
                            if(typeof options.reload === 'string') {
                                reloadName = options.reload;
                            } else {
                                if(options.reload.name) {
                                    reloadName = options.reload.name;
                                }
                            }
                        }
                        relativeParts = reloadName.split('.');
                        if(relativeParts.length) relativeParts.pop();
                    }
                    if($state.current) currentParts = $state.current.name.split('.');

                    var objBase = null;
                    var obj = self.handlerTree;
                    var fLeave = false;
                    for(var i = 0;i < currentParts.length;i++) {
                        var part = currentParts[i];
                        if(obj[part]) {
                            if(fLeave || i >= relativeParts.length || relativeParts[i] != part) {
                                handlerStack.push(obj[part].handlers);
                                fLeave = true;
                            } else {
                                objBase = obj[part];
                            }
                            obj = obj[part].children;
                        } else {
                            break;
                        }
                    }

                    if(fLeave) {
                        event.preventDefault();

                        var d = $q.defer();
                        var p = d.promise;
                        for (var i = handlerStack.length - 1; i >= 0; i--) {
                            for (var j = 0; j < handlerStack[i].length; j++) {
                                if (handlerStack[i][j]) {
                                    var f = function () {
                                        var handlerFunc = handlerStack[i][j];
                                        p = p.then(function (fConfirm) {
                                            if (fConfirm === true) {
                                                return handlerFunc();
                                            } else {
                                                return false;
                                            }
                                        });
                                    };
                                    f();
                                }
                            }
                        }

                        p.then(function (fConfirm) {
                            if (fConfirm) {
                                if (objBase) {
                                    objBase.children = {};
                                } else {
                                    self.handlerTree = {};
                                }
                                $state.go(toState, toParams, options);
                            } else {
                                bindFunc();
                            }
                        });

                        d.resolve(true);
                    }

                    unbind();
                });
            };

            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                bindFunc();
            });
        }
    ]);
});