/// <reference path="../../bower_components/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../controllers/HomeCtrl.ts" />

interface IUserProfileNav extends IHomeScope {
    test:string;
    home:HomeCtrl;
}

var userProfileNav:() => ng.IDirective = () => {

    return{
        restrict: 'E',
        templateUrl: 'views/directives/user-profile-nav.html',
        // replace directive tag with template info
        replace: true,
        scope: {
            ctrl: '=',

            text: '@',
            func: '&'
        },
        link: (scope:IUserProfileNav, element:ng.IAugmentedJQuery, attrs:ng.IAttributes) => {


        }
    }
}