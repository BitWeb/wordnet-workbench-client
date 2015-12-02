/**
 * Created by ivar on 23.11.15.
 */

define([], function () {

    angularAMD.directive('showtab', [function () {
        return {
            link: function ($scope, $element, $attrs) {
                $element.click(function(e) {
                    e.preventDefault();
                    $($element).tab('show');
                });
            }
        };
    }]);

});