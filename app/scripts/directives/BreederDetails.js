/// <reference path="../../bower_components/dt-angular/angular.d.ts" />

var breederDetails = function () {
    return {
        restrict: 'E',
        templateUrl: 'views/directives/breeder-details.html',
        transclude: true,
        // replace directive tag with template info
        replace: true,
        scope: {
            ctrl: '=',
            text: '@',
            func: '&'
        },
        link: function (scope, element, attrs) {
            //            SCOPE (USE just {{test}} . )
            scope.test = 'Test from link scope';

            // Element
            element.on('mouseover', function (e) {
                element.css({ opacity: 0.75 });
            });
            element.on('mouseout', function (e) {
                element.css({ opacity: 1 });
            });
        }
    };
};
//# sourceMappingURL=BreederDetails.js.map