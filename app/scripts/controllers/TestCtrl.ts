/// <reference path="IndexCtrl.ts" />

interface ITestScope extends IMainScope {
    test:TestCtrl;
    ctrl:IndexCtrl;
}
class TestCtrl {

    constructor($scope:ITestScope , public $state:ng.ui.IStateService,public toastr:Toastr, public DataService:DataService, public CopyProfileService:CopyProfileService) {
        $scope.test = this;
    }


     ShowSuccess(note:string) {

        this.toastr.info(note);
        }

     ShowError(note:string) {
        this.toastr.error(note);
        }

}