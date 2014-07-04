/// <reference path="../../../app/bower_components/DefinitelyTyped/jasmine/jasmine.d.ts" />
/// <reference path="../../../app/bower_components/DefinitelyTyped/angularjs/angular-mocks.d.ts" />
/// <reference path="../../../app/scripts/app.ts" />

describe("PuppiesLitter Controller Test", () => {
    // Setting a variables needed to perform test
    var $q,
        toastr = {
            error(error) {
            },
            info(info) {
            }
        },
        DataService,
        scope,
        $controller,
        ctrlpuppiesLitter;

    beforeEach(() => {

        angular.mock.inject(($injector) => {
            $q = $injector.get('$q');
            var $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
            scope = $rootScope.$new();
        });
    });

//Positive
    it('Should <DO SOMETH.>', () => {
        DataService = {
            getProfile: () => {
                // Create a postponed service which can be returned in promise
                var d = $q.defer();
                // emulating resolution
                d.resolve({ FirstName: 'Andriy', LastName: 'Shepitsen', UserName: 'andriy.shepitsen@aol.com' });
                return d.promise;
            }
        };

        ctrlpuppiesLitter = $controller('PuppiesLitterCtrl', {
            $scope: scope,
            DataService: DataService,
            toastr: toastr
        });
        scope.$apply();


        expect(1).toBe(1);
        //expect(ctrlpuppiesLitter.).toBeDefined();
        //expect(ctrlpuppiesLitter.).toBe();
    });

    it('Should    when error  ', () => {
        // Emulating Db request
        DataService = {
            getProfile: () => {
                // Create a postponed service which can be returned in promise
                var d = $q.defer();
                // emulating resolution
                d.reject();
                return d.promise;
            }
        };


        ctrlpuppiesLitter = $controller('PuppiesLitterCtrl', {
            $scope: scope,
            DataService: DataService,
            toastr: toastr

        });

        spyOn(ctrlpuppiesLitter, 'ShowError');
        scope.$apply();

        expect(2).toBe(2);
        // expect(ctrlpuppiesLitter.error).toBeDefined();
        // expect(ctrlpuppiesLitter.ShowError).toHaveBeenCalled();
    });
});

