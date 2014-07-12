/// <reference path="IndexCtrl.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/firebase/firebase-simplelogin.d.ts" />


interface IHomeScope extends IMainScope {
    home:HomeCtrl;
    ctrl:IndexCtrl;
    auth:FirebaseSimpleLogin
    authAction:FirebaseSimpleLogin
}
class HomeCtrl {

    FireUname:string;
    Uname:string;

    Auth:FirebaseSimpleLogin;
    Id:string;
    IdFire:string;
    IsHome:boolean;

    url:string;
    Followers:string[];
    Followings:string[];

    menuIndex:number;
    isOwner:boolean;
    hideMenu:boolean;

    constructor(public $scope, $location, public $stateParams, $firebase, $firebaseSimpleLogin, public $state:ng.ui.IStateService, public toastr:Toastr, public DataService:DataService) {
        $scope.home = this;
        this.menuIndex = 1;
        this.email = "breeder2@gmail.com";
        this.pass = "123456";
        this.hideMenu = true;


        var fref = new Firebase("https://torid-fire-6526.firebaseio.com/");

        $scope.auth = $firebaseSimpleLogin(fref);
        $scope.authAction = new FirebaseSimpleLogin(fref, (error, user) => {
            if (error) {
                // an error occurred while attempting login
                this.ShowError(error.toString());
            } else if (user) {
                this.FireUname = user.email;
                this.Uname = this.FireUname.replace(/(p)/g, '.');


                this.isOwner = this.Ownership();
                this.Id = this.GetBreederName();
                this.IdFire = this.Id.replace(/\./g, '(p)');
                DataService.getMyFollowings(user.email).then((followings:string[])=> {

                    this.Followings = followings;

                })
//
            } else {
            }

        });

    }


    email:string;
    pass:string;

    followUser(loggedUser:string, follower:string) {
        this.DataService.followUser(loggedUser, follower).then(()=> {

            this.$scope.home.AddToFollowings(follower);
        })
    }

    unFollowUser(loggedUser:string, follower:string) {
        this.DataService.unFollowUser(loggedUser, follower).then(()=> {
            this.$scope.home.RemoveFromFollowings(follower);
        })
    }

    navigate(menuIndex:number) {
        this.$scope.slide = this.animationDirection(menuIndex);
        this.hideMenu = false;


        if (menuIndex == 1) {
            this.menuIndex = 1;
            this.$state.go("user.profile.about1");
        }


        if (menuIndex == 2) {
            this.menuIndex = 2;
            this.$state.go('user.profile.photos2');
        }


        if (menuIndex == 3) {
            this.url = 'puppies';
            this.menuIndex = 3;
            this.$state.go('user.profile.puppies3');
        }


        if (menuIndex == 4) {
            this.url = 'details';
            this.menuIndex = 4;
            this.$state.go('user.profile.details4');
        }


        if (menuIndex == 5) {
            this.url = 'testimonials';
            this.menuIndex = 5;
            this.$state.go('user.profile.testimonials5');
        }

    }

    AddToFollowings(userName:string) {
        this.Followings.push(this.FireUnProcess(userName));
    }

    RemoveFromFollowings(userName:string) {
        var index = this.Followings.indexOf(this.FireUnProcess(userName))
        this.Followings.splice(index, 1);
    }

    FireProcess(userName:string) {
        return userName.replace(/\./g, '(p)');
    }

    FireUnProcess(userName:string) {
        return userName.replace(/\(p\)/g, '.');

    }

    animationDirection(menuIndex:number):string {

        if (menuIndex > this.menuIndex)
            return 'slide-left';
        else
            return 'slide-right';
    }

    Signin(email:string, pass:string) {

        this.$scope.authAction.login('password', {
            email: email,
            password: pass
        });
    }

    Logout() {
//        console.log('Test');

        this.$scope.authAction.logout();

//        this.ShowSuccess('You were successfully logged out');
    }

    IsSearchHidden:boolean;

    ShowSuccess(note:string) {

        this.toastr.info(note);
    }

    ShowError(note:string) {
        this.toastr.error(note);
    }

    GetBreederName() {

//        var loggedUser = angular.element('#loggedUser');
//        if (loggedUser == null) {
//            return '22';
//        }
//        var loggedUserTxt:string = loggedUser.text();
//
//        var start = loggedUserTxt.indexOf(',') + 1;
//        var finish = loggedUserTxt.indexOf('!');
        var user = this.FireUname;

        return this.FireUname;
//        return loggedUserTxt.substr(start, finish - start).trim();

    }

    Ownership() {
        var breederUserName:string = this.$stateParams.uname;

        var userName = this.GetBreederName();
//        console.log(breederUserName);
//        console.log(userName);

        this.isOwner = (breederUserName === userName);
        return this.isOwner;
    }
}