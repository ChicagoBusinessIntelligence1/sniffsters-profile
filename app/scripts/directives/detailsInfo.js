/// <reference path="../app.ts" />

var detailsInfo = function () {
    return {
        restrict: 'E',
        templateUrl: 'views/directives/details-info.html',
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
        }
    };
};
//# sourceMappingURL=detailsInfo.js.map
