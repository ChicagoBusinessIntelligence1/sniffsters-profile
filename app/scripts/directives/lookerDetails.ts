/// <reference path="../app.ts" />

interface ILookerDetails extends ng.IScope {
    test:string;
}

var lookerDetails:() => ng.IDirective = () => {

    return{
        restrict: 'E',
        templateUrl: 'views/directives/looker-details.html',
        transclude: true,
        // replace directive tag with template info
        replace: true,
        scope: {
            ctrl: '=',

            text: '@',
            func: '&'
        },
        link: (scope:ILookerDetails, element:ng.IAugmentedJQuery, attrs:ng.IAttributes) => {
//            SCOPE (USE just {{test}} . )
            scope.test = 'Test from link scope';


        }
    }
}