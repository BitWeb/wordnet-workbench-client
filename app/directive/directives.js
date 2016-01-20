/**
 * Created by ivar on 1.12.15.
 */

var relDirNames = {d: 'directed', b: 'bidirectional', n: 'non-directional'};

define(['appModule', 'jquery', 'angular-scroll'], function (app) {

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
});