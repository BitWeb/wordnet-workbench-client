/**
 * Created by ivar on 1.12.15.
 */

var relDirNames = {d: 'directed', b: 'bidirectional', n: 'non-directional'};

define(['appModule', 'jquery', 'angular-scroll', 'service/LexicalEntryUsageService'], function (app) {

    //console.log('appModule directives');

    app.directive('klSaveButton', ['$filter', function ($filter) {
        return {
            restrict: 'A',
            scope: {},
            template: '<i class="fa fa-save"></i> {{message}} ',
            controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

                var messages = $attrs.messages.split(':');

                var enabled = false;
                var processing = false;
                var wasProcessing = false;

                var updateMessage = function () {
                    if (processing) {
                        $scope.message = messages[1];
                        wasProcessing = true;
                        return;
                    }
                    if (wasProcessing == true) {
                        $scope.message = messages[2];
                        wasProcessing = false;
                        return;
                    }
                    $scope.message = messages[0];
                };

                var updateStatus = function () {
                    if (processing) {
                        $element.attr('disabled', true);
                        return;
                    }
                    if (enabled) {
                        $element.removeAttr('disabled');
                        return;
                    }
                    $element.attr('disabled', true);
                };

                var updateElement = function () {
                    updateMessage();
                    updateStatus();
                };

                updateElement();

                $attrs.$observe('enabled', function (value) {
                    enabled = value == 'true';
                    updateElement();
                });

                $attrs.$observe('processing', function (value) {
                    processing = value == 'true';
                    updateElement();
                });
            }]
        };
    }]);

    app.directive('wnwbScrollTo', ['$document', function ($document) {
        console.log('creating wnwbScrollTo directive');
        return {
            link: function ($scope, $element, $attrs) {
                console.log('scrollto');
                $document.scrollToElementAnimated($element).then(function() {
                    console && console.log('You just scrolled to the top!');
                });
                /*$element.click(function(e) {
                 e.preventDefault();
                 $($element).tab('show');
                 });*/
            }
        };
    }]);

    app.directive('wnwbRelDir', ['$document', function ($document) {
        console.log('creating wnwbRelDir');
        return {
            //require: 'ngModel',
            link: function($scope, $element, $attrs) {
                var newVal = '';
                switch($attrs.wnwbRelDir) {
                    case 'd':
                        newVal = 'Directed';
                        break;
                    case 'b':
                        newVal = 'Bidirectional';
                        break;
                    case 'n':
                        newVal = 'Non-directional';
                        break;
                    default:
                }
                $element.html(newVal);
                /*ngModel.$formatters.push(function(val){
                 return relDirNames[val];
                 });*/
            }
        };
    }]);

    app.directive('confirmOnExit', function() {
        return {
            scope: {
                confirmOnExit: '&',
                confirmMessageWindow: '@',
                confirmMessageRoute: '@',
                confirmMessage: '@'
            },
            link: function($scope, elem, attrs) {
                window.onbeforeunload = function(){
                    if ($scope.confirmOnExit()) {
                        return $scope.confirmMessageWindow || $scope.confirmMessage;
                    }
                };
                var $locationChangeStartUnbind = $scope.$on('$locationChangeStart', function(event, next, current) {
                    if ($scope.confirmOnExit()) {
                        if(! confirm($scope.confirmMessageRoute || $scope.confirmMessage)) {
                            event.preventDefault();
                        }
                    }
                });

                $scope.$on('$destroy', function() {
                    window.onbeforeunload = null;
                    $locationChangeStartUnbind();
                });
            }
        };
    });

    
     
    app.directive('lexUsage', ['service/LexicalEntryUsageService',function (lexicalEntryUsageService) {

        var controller = ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {      
            var vm = this;
            vm.datasource = {};
            
            $scope.ignoreLemmaChange = false;
            vm.clearHistory = function () {
                vm.datasource = {};
            };

            vm.makeUsageHistory = function (lemma) {
               
                var listPromise = lexicalEntryUsageService.getLexicalEntryUsagePromise( lemma.trim(),vm.lexid);
                listPromise.then(function (result) {
                    console.debug(listPromise);
                    return vm.datasource = lexicalEntryUsageService.makeLexicalEntryUsageListForDirectiveLexUsage(result); 
                });
            };

            $scope.makeUsageHistory = vm.makeUsageHistory;

            function init() {
                vm.datasource = angular.copy(vm.datasource);
                vm.lemma = angular.copy(vm.lemma);
                vm.lexid = angular.copy(vm.lexid);
            }

            init();
        }];    


        return {
            restrict: 'EA', //Default for 1.3+
            scope: {
                lemma: '=',
                lexid: '='
                
            },
            controller: controller,
            controllerAs: 'vm',
            bindToController: true, //required in 1.3+ with controllerAs
            templateUrl: 'view/common/lexEntryUsageList.html',
            link: function ($scope, $element, $attrs) {

                $scope.$watch("vm.lemma",function(newValue,oldValue) {
                    //This gets called when data changes.
                    console.debug('[lex-usage directive] lemma value changed', newValue, oldValue);
                    
                    $scope.makeUsageHistory(newValue);
   
                });
            }
        };
    }]);
});