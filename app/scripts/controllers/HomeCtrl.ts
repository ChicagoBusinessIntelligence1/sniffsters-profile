/// <reference path="IndexCtrl.ts" />
/// <reference path="../utils/IUserGenerator.ts" />
/// <reference path="../utils/BreederGenerator.ts" />
/// <reference path="../utils/LookerGenerator.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/firebase/firebase-simplelogin.d.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/angularfire/angularfire.d.ts" />


interface IHomeScope extends IMainScope {
    home:HomeCtrl;
    ctrl:IndexCtrl;
}
class HomeCtrl {
    userName:any;
    userNameFire:string;

    MainUrl:string;
    MainRef:Firebase;
    MainRefFire:any;

    auth:any;

    Id:string;
    IsHome:boolean;

    url:string;
    Followings:string[];
    menuIndex:number;

    isBreeder:boolean;
    isOwner:boolean;
    hideMenu:boolean;

    isLoggedIn:boolean = false;

    constructor(public $scope, public $modal, public settings, public $filter, public $stateParams, public $q:ng.IQService, public $firebase, public $firebaseSimpleLogin, public $state:ng.ui.IStateService, public toastr:Toastr, public DataService:DataService) {

        $scope.home = this;
        this.menuIndex = 1;
        $scope.fetchDog = (breed, location)=> {
            if (breed == null) {
                breed = {name: null};
            }


            if (location == null) {
                location = {name: null};
            }
            $state.go('sniff.breeders', {
                breed: breed.name,
                location: location.name
            });
        }

        this.MainUrl = settings.mainUrl;
        this.MainRef = new Firebase(this.MainUrl);
        this.MainRefFire = $firebase(new Firebase(this.MainUrl));

        $scope.breedsRef = this.MainRefFire.$child('breeders');
        $scope.breedsRef.$on('value', (snapshot:any)=> {
            var bs = snapshot.snapshot.value;

            var breedsR = _.values(_.values(_.compact(_.pluck(_.pluck($filter('orderByPriority')(bs), 'profile'), 'breeds'))));
            $scope.breeds = _.map(_.uniq(_.flatten(_.map(breedsR, (breed)=> {

                var arrTemp = _.values(breed);
                return arrTemp;
            }))), (breed)=> {
                return {name: breed}
            });
        });

        $scope.locationRef = this.MainRefFire.$child('breeders');
        $scope.locationRef.$on('value', (snapshot:any)=> {
            var bs = snapshot.snapshot.value;

            var locationVal = _.uniq(_.compact(_.pluck(_.pluck($filter('orderByPriority')(bs), 'profile'), 'Location')));
            $scope.locations = _.map(locationVal, (location)=> {
                return {name: location};
            })
        });


        this.auth = this.$firebaseSimpleLogin(this.MainRef);
        this.auth.$getCurrentUser().then((user)=> {
            if (user === null) {
                return;
            }
            this.Breedership(this.FireProcess(user.email)).then(() => {
                this.userName = user.email;
                this.isLoggedIn = true;

                this.userNameFire = this.FireProcess(this.userName);
            });
        });
    }

    Signin(email:string, pass:string) {
        this.auth = this.$firebaseSimpleLogin(this.MainRef);

        this.auth.$login('password', {
            email: email,
            password: pass

        }).then((user)=> {
            this.Breedership(this.FireProcess(user.email)).then(() => {
                this.userName = user.email;
                this.isLoggedIn = true;

                this.userNameFire = this.FireProcess(this.userName);

                this.isLoggedIn = true;
                if (this.isBreeder === true) {
                    this.$state.go('user.profile.about1', {uname: user.email});
                }

                if (this.isBreeder === false) {
                    this.$state.go('looker.account', {uname: user.email});
                }
            })
        });
    }

    Breedership(email:string) {
        var d = this.$q.defer();

        var breederUrl = this.MainUrl + "breeders/" + email;
        var lookerUrl = this.MainUrl + "lookers/" + email;

        var breederRef = this.$firebase(new Firebase(breederUrl));
        var lookerRef = this.$firebase(new Firebase(lookerUrl));

        breederRef.$on('value', (snapshot:any)=> {
            var breeder = this.$filter('orderByPriority')(snapshot.snapshot.value);
            if (breeder.length > 0) {
                this.isBreeder = true;
                d.resolve();
            }
        });
        lookerRef.$on('value', (snapshot:any)=> {
            var looker = this.$filter('orderByPriority')(snapshot.snapshot.value);
            if (looker.length > 0) {
                this.isBreeder = false;
                d.resolve();
            }
        });

        return d.promise;
    }

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


    FacebookSignin() {
        this.auth.$login('facebook',
            {rememberMe: true}
        ).then((user)=> {
                if (user) {
                    this.userName = user.displayName;

                } else {
                    // user logout
                }
            }, (error)=> {
                this.ShowError(error);
            })
    }

    Logout() {
        this.isLoggedIn = false;
        this.auth.$logout();
        this.$state.go('home');
    }

    IsSearchHidden:boolean;

    ShowSuccess(note:string) {
        this.toastr.info(note);
    }

    ShowError(note:string) {
        this.toastr.error(note);
    }


    Ownership() {
        var breederUserName:string = this.$stateParams.uname;
        if (this.auth.user === null)
            return false;
        this.isOwner = (breederUserName === this.auth.user.email);
        return this.isOwner;
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

}