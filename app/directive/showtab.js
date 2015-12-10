/**
 * Created by ivar on 23.11.15.
 */

define([], function () {

    console.log('angularAMD directives');

    angularAMD.directive('showtab', [function () {
        console.log('creating showtab directive');
        return {
            link: function ($scope, $element, $attrs) {
                $element.click(function(e) {
                    console.log('creating showtab directive');
                    e.preventDefault();
                    $($element).tab('show');
                });
            }
        };
    }]);

    angularAMD.directive('wnwbOpenView', [function () {
        console.log('creating wnwbOpenView directive');
        return {
            link: function ($scope, $element, $attrs) {
                $element.click(function (e) {
                    console.log('click');
                    console.log($attrs);
                });
                /*$element.click(function(e) {
                    e.preventDefault();
                    $($element).tab('show');
                });*/
            }
        };
    }]);

    angularAMD.directive('mytest', [function () {
        console.log('creating mytest directive');
        return {
            link: function ($scope, $element, $attrs) {
                $element.click(function (e) {
                    console.log('click');
                    console.log($attrs);
                });
                /*$element.click(function(e) {
                 e.preventDefault();
                 $($element).tab('show');
                 });*/
            }
        };
    }]);

});