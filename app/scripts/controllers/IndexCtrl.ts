/// <reference path="../services/CopyProfileService.ts" />
/// <reference path="../models/IBreederProfile.ts" />
/// <reference path="../services/DataService.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/angular-ui/angular-ui-router.d.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/toastr/toastr.d.ts" />

interface IMainScope extends ng.IScope {
    index:IndexCtrl;
}
class IndexCtrl {
    BreederProfile:IBreederProfile;
    BreederProfileEdit:IBreederProfile;

    BreederProfileCopy:IBreederProfile;
    error:boolean;
    Id:string;
    url:string;
    spinner:boolean;
    menuIndex:number;

    constructor(public $scope, $location, public $rootScope, public $window, public $state:ng.ui.IStateService, public toastr, public DataService:DataService, public CopyProfileService:CopyProfileService) {

        this.url = 'about';
        $scope.navigate = (menuIndex:number) => {
            if (menuIndex == 2) {
                $scope.slide = 'slide-left';
                $location.url('/profile/photos');
            }

            if (menuIndex == 1) {
                $scope.slide = 'slide-right';
                $location.url('/profile/about');
            }
        }

        this.menuIndex = 1;
        $scope.slide = '';

        $rootScope.back = () => {
            $scope.slide = 'slide-left';
            $window.history.back();
        }

        $rootScope.forward = () => {
            $scope.slide = 'slide-right';
            $window.history.forward();
        }

        $scope.index = this;
        this.spinner = true;

        var promiseT = this.DataService.getProfile<IBreederProfile>();
        promiseT.then((breederProfile:IBreederProfile) => {
            //Success
            this.error = false;
            this.BreederProfile = breederProfile;

            this.Id = breederProfile.Email;
//            Put a received BreederProfile to CopyProfileService, using it like container
//            in order we can inject CopyProfileService in other Ctrls and have access to BreederProfile Data (SHaring data between controllers)
            this.CopyProfileService.SetProfile(breederProfile);
            this.BreederProfileEdit = CopyProfileService.GetProfileClone();
        }, () => {
            //Error
            this.error = true;
            this.ShowError("Error in Db Connection")
        }).finally(() => {
            this.spinner = false;
        })
    }

    SaveKennelName() {
        var breederProfileOriginal:IBreederProfile = this.CopyProfileService.GetProfileClone();

        breederProfileOriginal.KennelName = this.BreederProfileEdit.KennelName;
        breederProfileOriginal.Story = this.BreederProfileEdit.Story;
        this.Save(breederProfileOriginal);
    }

    SaveAboutParents() {
        var breederProfileOriginal:IBreederProfile = this.CopyProfileService.GetProfileClone();

        breederProfileOriginal.Parents = this.BreederProfileEdit.Parents;
        breederProfileOriginal.Girls = this.BreederProfileEdit.Girls;
        breederProfileOriginal.Boys = this.BreederProfileEdit.Boys;
        console.log(breederProfileOriginal);

        this.Save(breederProfileOriginal);
    }

    SaveAddInfo() {
        var breederProfileOriginal:IBreederProfile = this.CopyProfileService.GetProfileClone();
        breederProfileOriginal.AddInfo = this.BreederProfileEdit.AddInfo;

        this.Save(breederProfileOriginal);
    }

    Next(state:string) {
        this.$state.go(state);
    }

    ShowError(errorMessage:string) {
        this.toastr.error(errorMessage);
    }

    ShowSuccess(successMessage:string) {
        this.toastr.success(successMessage);
    }

    Clone() {
        this.BreederProfileCopy = this.CopyProfileService.GetProfileClone();
    }

    GetClone() {
        return this.CopyProfileService.GetProfileClone();
    }

    UpdateBreederProfile(breederProfile:IBreederProfile) {
        this.BreederProfile = breederProfile;
    }

    Save(breederProfile:IBreederProfile) {
//Run Service UpdateProfile Method and get promise back
        var promise:ng.IPromise<IBreederProfile> = this.DataService.updateProfile<IBreederProfile>(breederProfile);
        promise.then(
            () => {
                // Success
                this.CopyProfileService.SetProfile(breederProfile);
//                Update scope on IndexCtrl.
                this.UpdateBreederProfile(breederProfile);

                this.ShowSuccess('Successfully Saved');
            },
            () => {
                // Error
                this.ShowError('Db Connection Problem');
            });
    }
}
