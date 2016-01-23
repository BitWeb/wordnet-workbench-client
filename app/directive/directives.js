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
            restrict: 'A',
            require: 'ngModel',
            scope: {
                wnwbRelDir: '='
            },
            template: '{{test}}',
            link: function($scope, $element, $attrs, ngModel) {
                console.log('link');
                console.log(ngModel);

                console.log($attrs);
                $attrs.$observe('wnwbRelDir', function (value) {
                    console.log('observe');
                });

                ngModel.$parsers.push(function (value) {
                    console.log('formatter:');
                    console.log(value);
                    return 'brown';
                });
                /*
                $scope.$watch('test', function (newValue, oldValue) {
                    var newOutVal = '';
                    switch(newValue) {
                        case 'd':
                            newOutVal = 'Directed';
                            break;
                        case 'b':
                            newOutVal = 'Bidirectional';
                            break;
                        case 'n':
                            newOutVal = 'Non-directional';
                            break;
                        default:
                    }
                    $element.html(newOutVal);
                });
                */
            }
        };
    }]);
});