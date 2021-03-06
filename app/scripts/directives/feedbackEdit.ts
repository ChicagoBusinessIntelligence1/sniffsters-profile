/// <reference path="../models/IBreederProfile.ts" />
/// <reference path="../controllers/HomeCtrl.ts" />
var feedbackEdit:() => ng.IDirective = () => {

    return{
        restrict: 'E',
        templateUrl: 'views/directives/feedback-edit.html',
        // replace directive tag with template info
        replace: true,
        controller: ($scope, $stateParams, $firebase, $state) => {
            var id:string = $stateParams.id;

            $scope.home.auth.$getCurrentUser().then((user) => {
                $scope.home.Breedership($scope.home.FireProcess(user.email)).then(() => {
                    var feedbackUrl = $scope.home.MainUrl + 'breeders/' + $scope.home.FireProcess(user.email) + '/feedbacks/' + id;
                    $scope.feedback = $firebase(new Firebase(feedbackUrl));
                })
            })
            $scope.updateFeedback = (clientName, evaluation, body) => {
                var feedbackNew:IFeedback = new Feedback();
                feedbackNew.ClientName = clientName;
                feedbackNew.FeedbackBody = body;
                feedbackNew.Evaluation = evaluation;

                $scope.feedback.$set(
                    {ClientName: clientName,
                        Evaluation: evaluation,
                        FeedbackBody: body}).then(() => {
                        $state.go('^');
                    });
            }
        }
    }
}
