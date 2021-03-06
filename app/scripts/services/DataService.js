/// <reference path="../../bower_components/DefinitelyTyped/underscore/underscore.d.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/angularfire/angularfire.d.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/firebase/firebase.d.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../models/IBreederProfile.ts" />
var DataService = (function () {
    function DataService($http, $q, $firebase, settings, $filter) {
        this.$http = $http;
        this.$q = $q;
        this.$firebase = $firebase;
        this.settings = settings;
        this.$filter = $filter;
        this.url = settings.mainUrl;
        this.urlLooker = this.url + "lookers/";
        this.urlBreeder = this.url + "breeders/";
    }
    // =Messages
    DataService.prototype.sendReply = function (userName, corrUserName, corrUserNameNick, reply, amISender) {
        userName = this.FireProcess(userName);
        corrUserName = this.FireProcess(corrUserName);
        corrUserNameNick = this.FireProcess(corrUserNameNick);

        var d = this.$q.defer();
        var corrUserUrl = this.urlBreeder + userName + "/messages";
        var corrUserRef = this.$firebase(new Firebase(corrUserUrl));

        var note = new Note();
        note.amISender = amISender;
        note.sent = Date.now();
        note.body = reply;

        if (amISender == true) {
            note.isUnread = false;
        } else {
            note.isUnread = true;
        }

        note.isTrash = false;
        note.userName = corrUserName;
        note.nickName = corrUserNameNick;
        corrUserRef.$add(note);

        d.resolve();

        return d.promise;
    };

    DataService.prototype.sendLookerReply = function (userName, corrUserName, corrUserNameNick, reply, amISender) {
        userName = this.FireProcess(userName);
        corrUserName = this.FireProcess(corrUserName);
        corrUserNameNick = this.FireProcess(corrUserNameNick);
        var d = this.$q.defer();

        var corrUserUrl = this.urlLooker + userName + "/messages";
        var corrUserRef = this.$firebase(new Firebase(corrUserUrl));

        var note = new Note();
        note.amISender = amISender;
        note.sent = Date.now();

        note.body = reply;

        if (amISender == true) {
            note.isUnread = false;
        } else {
            note.isUnread = true;
        }
        note.isTrash = false;
        note.userName = corrUserName;
        note.nickName = corrUserNameNick;
        corrUserRef.$add(note);

        d.resolve();

        return d.promise;
    };

    DataService.prototype.deleteConversation = function (userName, corrUserName, isBreeder) {
        userName = this.FireProcess(userName);
        corrUserName = this.FireProcess(corrUserName);

        var d = this.$q.defer();
        var url = isBreeder ? this.urlBreeder : this.urlLooker;

        var messagesUrl = url + userName + "/messages";
        var notesRef = this.$firebase(new Firebase(messagesUrl));

        var keys = notesRef.$getIndex();
        var allNotes = [];
        keys.forEach(function (key) {
            allNotes.push(notesRef[key]);
        });
        var notes = _.where(allNotes, { isTrash: false, userName: corrUserName });

        notes.forEach(function (note) {
            note.isTrash = true;
        });
        notesRef.$save();
        d.resolve();

        return d.promise;
    };

    DataService.prototype.recoverConversation = function (userName, corrUserName, isBreeder) {
        userName = this.FireProcess(userName);
        corrUserName = this.FireProcess(corrUserName);

        var d = this.$q.defer();
        var url = isBreeder ? this.urlBreeder : this.urlLooker;
        var messagesUrl = url + userName + "/messages";
        var notesRef = this.$firebase(new Firebase(messagesUrl));

        var keys = notesRef.$getIndex();
        var allNotes = [];
        keys.forEach(function (key) {
            allNotes.push(notesRef[key]);
        });
        var notes = _.where(allNotes, { isTrash: true, userName: corrUserName });

        notes.forEach(function (note) {
            note.isTrash = false;
        });
        notesRef.$save();
        d.resolve();

        return d.promise;
    };

    DataService.prototype.deleteForever = function (userName, corrUserName, isBreeder) {
        userName = this.FireProcess(userName);
        corrUserName = this.FireProcess(corrUserName);

        //
        var d = this.$q.defer();
        var url = isBreeder ? this.urlBreeder : this.urlLooker;
        var messagesUrl = url + userName + "/messages";
        var notesRef = this.$firebase(new Firebase(messagesUrl));

        var keys = notesRef.$getIndex();
        keys.forEach(function (key) {
            var value = notesRef[key];
            if (value.isTrash === true && value.userName === corrUserName) {
                notesRef.$remove(key);
            }
        });

        notesRef.$save();
        d.resolve();

        return d.promise;
    };

    DataService.prototype.getLookerMessages = function (userName) {
        var _this = this;
        userName = this.FireProcess(userName);
        var d = this.$q.defer();
        var fireMessages = this.$firebase(new Firebase(this.url + "lookers/" + userName + "/messages"));

        fireMessages.$on('value', function (snapshot) {
            var messages = snapshot.snapshot.value;

            d.resolve(_this.$filter('orderByPriority')(messages));
        });
        return d.promise;
    };

    DataService.prototype.getMessages = function (userName) {
        var _this = this;
        userName = this.FireProcess(userName);
        var d = this.$q.defer();

        var fireMessages = this.$firebase(new Firebase(this.urlBreeder + userName + "/messages"));

        fireMessages.$on('value', function (snapshot) {
            var messages = snapshot.snapshot.value;

            d.resolve(_this.$filter('orderByPriority')(messages));
        });
        return d.promise;
    };

    DataService.prototype.FireProcess = function (userName) {
        return userName.replace(/\./g, '(p)');
    };

    DataService.prototype.FireUnProcess = function (userName) {
        return userName.replace(/\(p\)/g, '.');
    };

    // =Followeings
    DataService.prototype.getMyLookerFollowings = function (userName) {
        var _this = this;
        userName = this.FireProcess(userName);

        var d = this.$q.defer();

        var followingsUrl = this.url + "lookers/" + userName + "/followings";
        var followingsRef = this.$firebase(new Firebase(followingsUrl));

        followingsRef.$on('value', function (snapshot) {
            var followings = snapshot.snapshot.value;
            var followingssArr = _.map(_.keys(followings), function (value) {
                return _this.FireUnProcess(value);
            });

            d.resolve(followingssArr);
        });
        return d.promise;
    };

    DataService.prototype.getMyFollowings = function (userName) {
        var _this = this;
        userName = this.FireProcess(userName);

        var d = this.$q.defer();

        var followingsUrl = this.urlBreeder + userName + "/followings";
        var followingsRef = this.$firebase(new Firebase(followingsUrl));

        followingsRef.$on('value', function (snapshot) {
            var followings = snapshot.snapshot.value;
            var followingssArr = _.map(_.keys(followings), function (value) {
                return _this.FireUnProcess(value);
            });

            d.resolve(followingssArr);
        });
        return d.promise;
    };

    DataService.prototype.getMyFollowers = function (userName) {
        var _this = this;
        userName = this.FireProcess(userName);

        var d = this.$q.defer();

        var followersUrl = this.urlBreeder + userName + "/followers";
        var followersRef = this.$firebase(new Firebase(followersUrl));

        followersRef.$on('value', function (snapshot) {
            var followers = snapshot.snapshot.value;
            var followersArr = _.map(_.keys(followers), function (value) {
                return _this.FireUnProcess(value);
            });

            d.resolve(followersArr);
        });
        return d.promise;
    };

    DataService.prototype.followLookerUser = function (userName, followerName) {
        userName = this.FireProcess(userName);
        followerName = this.FireProcess(followerName);
        var d = this.$q.defer();

        var followingsUrl = this.url + "lookers/" + userName + "/followings";
        var followingsRef = this.$firebase(new Firebase(followingsUrl));

        var followingRef = followingsRef.$child(followerName);
        followingRef.$add(1);

        followingsRef.$save();

        d.resolve();
        return d.promise;
    };

    DataService.prototype.followUser = function (userName, followerName, amIBreeder) {
        userName = this.FireProcess(userName);
        followerName = this.FireProcess(followerName);
        var d = this.$q.defer();

        var userType = amIBreeder ? this.urlBreeder : this.urlLooker;

        var followingsUrl = userType + userName + "/followings";
        var followingsRef = this.$firebase(new Firebase(followingsUrl));

        var followingRef = followingsRef.$child(followerName);
        followingRef.$add(1);

        followingsRef.$save();

        var followersUrl = this.urlBreeder + followerName + "/followers";
        var followersRef = this.$firebase(new Firebase(followersUrl));

        var followerRef = followersRef.$child(userName);
        followerRef.$add(amIBreeder);

        followersRef.$save();

        d.resolve();
        return d.promise;
    };

    DataService.prototype.unFollowUser = function (userName, followerName, amIBreeder) {
        userName = this.FireProcess(userName);
        followerName = this.FireProcess(followerName);
        var d = this.$q.defer();

        var userType = amIBreeder ? this.urlBreeder : this.urlLooker;

        var followingUrl = userType + userName + "/followings/" + this.FireProcess(followerName);
        var followingRef = this.$firebase(new Firebase(followingUrl));

        followingRef.$remove();
        followingRef.$save();

        var followerUrl = this.urlBreeder + followerName + "/followers/" + userName;
        var followerRef = this.$firebase(new Firebase(followerUrl));

        followerRef.$remove();
        followerRef.$save();

        d.resolve();
        return d.promise;
    };

    //=Profile
    DataService.prototype.getProfile = function (id) {
        var key = id.replace(/\./g, '(p)');
        this.fb = this.$firebase(new Firebase(this.urlBreeder + key + "/profile"));
        this.fb.$on('value', function (snapshot) {
            var breeder = snapshot.snapshot.value;
            d.resolve(breeder);
        });
        var d = this.$q.defer();

        return d.promise;
    };

    DataService.prototype.getAllProfiles = function () {
        var _this = this;
        var d = this.$q.defer();

        this.fb = this.$firebase(new Firebase(this.urlBreeder));
        this.fb.$on('value', function (snapshot) {
            var breeders = snapshot.snapshot.value;
            var breedersArr = (_this.$filter('orderByPriority')(breeders));

            d.resolve((breedersArr));
        });
        var d = this.$q.defer();

        return d.promise;
    };

    DataService.prototype.updateProfile = function (t) {
        var d = this.$q.defer();

        var key = t.UserName.replace(/\./g, '(p)');

        t = _.omit(t, ['Breeds', 'breeds', 'LittersNumber']);

        var firebaseUrl = this.urlBreeder + key + '/profile';
        this.fb = this.$firebase(new Firebase(firebaseUrl));

        for (var key in t) {
            this.fb[key] = t[key];
        }

        this.fb.$save();
        d.resolve();
        return d.promise;
    };

    //=Photo Galleries
    DataService.prototype.getGalleries = function (id) {
        var key = id.replace(/\./g, '(p)');
        var fireGalleries = this.$firebase(new Firebase(this.urlBreeder + key + "/galleries"));

        fireGalleries.$on('value', function (snapshot) {
            var galleries = snapshot.snapshot.value;
            d.resolve(galleries);
        });
        var d = this.$q.defer();

        return d.promise;
    };

    //=Testimonials
    DataService.prototype.saveNewTestimonials = function (feedbacks, userName) {
        var d = this.$q.defer();
        var fireTestimonials = this.$firebase(new Firebase(this.urlBreeder + userName + "/testimonials"));
        var keys = fireTestimonials.$getIndex();
        return d.promise;
    };

    /*    updateFeedback(feedback:IFeedback) {
    var d = this.$q.defer();
    
    this.$http.post('http://localhost:44300/BreederPersonal/UpdateFeedback', {
    feedback: feedback
    })
    .success(() => {
    d.resolve();
    }).error(() => {
    d.reject();
    });
    return d.promise;
    }*/
    //    =Litters
    DataService.prototype.getLitters = function (userName) {
        var _this = this;
        var d = this.$q.defer();

        var fireLitters = this.$firebase(new Firebase(this.urlBreeder + userName + "/litters"));

        fireLitters.$on('value', function (snapshot) {
            var litters = snapshot.snapshot.value;

            var arrLitters = _.rest(_this.$filter('orderByPriority')(litters));
            arrLitters.forEach(function (litter) {
                litter.Photos = _.rest(_this.$filter('orderByPriority')(litter.Photos));
            });

            d.resolve(arrLitters);
        });
        return d.promise;
    };

    DataService.prototype.saveNewLitters = function (userName, litters) {
        var d = this.$q.defer();
        var fireLitters = this.$firebase(new Firebase(this.urlBreeder + userName + "/litters"));
        var keys = fireLitters.$getIndex();
        return d.promise;
    };

    DataService.prototype.updateTitle = function (galleryId, title, userName) {
        var d = this.$q.defer();

        var fireGallery = this.$firebase(new Firebase(this.urlBreeder + userName + "/galleries/" + galleryId));
        fireGallery.$update({ Title: title }).then(function () {
            d.resolve();
        });

        //        fireGallery.$save();
        return d.promise;
    };

    DataService.prototype.deletePhoto = function (galleryId, photoId, userName) {
        var d = this.$q.defer();
        var fireGalleriesPhotos = this.$firebase(new Firebase(this.urlBreeder + userName + "/galleries/" + galleryId + "/Photos/" + photoId));

        fireGalleriesPhotos.$remove().then(function () {
            d.resolve();
        });
        return d.promise;
    };
    return DataService;
})();
