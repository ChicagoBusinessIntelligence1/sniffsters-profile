/// <reference path="HomeCtrl.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/angularfire/angularfire.d.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/firebase/firebase.d.ts" />
var TrashCtrl = (function () {
    function TrashCtrl($scope, $firebaseSimpleLogin, $modal, $state, toastr, DataService) {
        var _this = this;
        this.$scope = $scope;
        this.$state = $state;
        this.toastr = toastr;
        this.DataService = DataService;
        $scope.trash = this;

        $scope.home.hideMenu = true;

        var fref = new Firebase("https://torid-fire-6526.firebaseio.com/");
        $scope.auth = $firebaseSimpleLogin(fref);
        $scope.authAction = new FirebaseSimpleLogin(fref, function (error, user) {
            if (error) {
                // an error occurred while attempting login
                _this.ShowError(error.toString());
            } else if (user) {
                //                DataService.getMessages($scope.home.IdFire, false).then((messages:any)=> {
                //                    this.fireMessages = messages;
                //
                //                    this.corrUsersFire = _.keys(messages);
                //                    this.corrUsers = _.map(this.corrUsersFire, (userFire) => {
                //                        return userFire.toString().replace(/\(p\)/g, '.');
                //                    });
                //
                //                    if (this.selectedUser == null) {
                //                        this.selectedUserIndex = 0;
                //                        this.SetSelectedUser(this.selectedUserIndex);
                //                    }
                //
                //
                //                })
                //
            } else {
            }
        });
    }

    TrashCtrl.prototype.Delete = function () {
        var _this = this;
        this.DataService.deleteForever(this.$scope.home.FireUname, this.selectedUserFire).then(function () {
            _this.corrUsers.splice(_this.selectedUserIndex, 1);
            _this.corrUsersFire.splice(_this.selectedUserIndex, 1);
            _this.SetSelectedUser(0);
        });
    };

    TrashCtrl.prototype.Recover = function () {
        var _this = this;
        this.DataService.recoverConversation(this.$scope.home.FireUname, this.selectedUserFire).then(function () {
            _this.corrUsers.splice(_this.selectedUserIndex, 1);
            _this.corrUsersFire.splice(_this.selectedUserIndex, 1);
            _this.SetSelectedUser(0);
        });
    };

    TrashCtrl.prototype.Send = function () {
        this.DataService.sendReply(this.$scope.home.FireUname, this.selectedUserFire, this.reply.body).then(function () {
            //            this.selectedUserMessages.push({amISender: true, body: this.reply.body, sent: Date.now().toString()})
            //            this.reply.body = "";
        });
    };

    TrashCtrl.prototype.SetSelectedUser = function (arrIndex) {
        this.selectedUserIndex = arrIndex;

        this.selectedUserFire = this.corrUsersFire[this.selectedUserIndex];
        this.selectedUser = this.corrUsers[this.selectedUserIndex];

        this.selectedUserMessages = _(this.fireMessages[this.selectedUserFire]).values();
    };

    TrashCtrl.prototype.ShowSuccess = function (note) {
        this.toastr.info(note);
    };

    TrashCtrl.prototype.ShowError = function (note) {
        this.toastr.error(note);
    };
    return TrashCtrl;
})();
