/// <reference path="../../bower_components/DefinitelyTyped/angularjs/angular.d.ts" />


var #jname# = () => {

    return{
        restrict: 'E',
        templateUrl: 'views/directives/#dname#.html',
        replace: true,
        scope: {
            ctrl: '=',

            text: '@',
            func: '&'
        },
        controller($scope){

        },
        link: (scope, element, attrs) => {



        }
    }
}
