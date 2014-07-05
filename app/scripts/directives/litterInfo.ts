/// <reference path="../../bower_components/DefinitelyTyped/angularjs/angular.d.ts" />

interface ILitterInfo extends ng.IScope {
    test:string;
}

var litterInfo:() => ng.IDirective = () => {

    return{
        restrict: 'E',
        templateUrl: 'views/directives/litter-info.html',
        transclude: true,
        // replace directive tag with template info
        replace: true,
        scope: {
            l: '=',
            puppies: '=',
            userName: '@'
        },
        controller: ($scope, $stateParams) => {
            var id = $stateParams.id;
            $scope.puppies.SelectedLitter = $scope.puppies.Litters[id];
        },

        link: (scope:ILitterInfo, element:ng.IAugmentedJQuery, attrs:ng.IAttributes) => {
        }
    }
}