/// <reference path="../../bower_components/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/underscore/underscore.d.ts" />

var svImage = ($compile, $document) => {

    return{
        restrict: 'E',
        templateUrl: 'views/directives/sv-image.html',
        replace: true,
        scope: {
            i: '=',
            index: '=',
            isMult: '=',

            width: '=',
            height: '=',
            fireRef: '=',
            onFileSelect: '&',
            closeModal: '&',
            okModal: '&'
        },
        controller($scope) {
            $scope.saveChanges = () => {

//                $scope.fireRef.$on('value', (snapshot:any)=> {
//                    var data = snapshot.snapshot.value;
//                    if (data === null) {
//
//                        $scope.fireRef.$add($scope.i.file64).then(() => {
//                            $scope.closeModal();
//                        });
//
//                    } else {
//                        $scope.fireRef.$add($scope.i.file64).then(() => {
//                            $scope.closeModal();
//                        });
////                        var key = _.keys($scope.fireRef)[0];
////                        $scope.fireRef[key] = $scope.i.file64;
////                        $scope.fireRef.$save().then(() => {
////                            $scope.closeModal();
////                        })
//
//                    }
//                });

                $scope.fireRef.$remove();
                $scope.fireRef.$add($scope.i.file64).then(() => {
                    $scope.closeModal();
                });
                $scope.closeModal();
//                var arrKeys = _.keys($scope.fireRef);

//                if (arrKeys.length == 0) {
//
//                    $scope.fireRef.$add($scope.i.file64).then(() => {
//                        $scope.closeModal();
//                    });
//                } else {
//                    $scope.fireRef.$update($scope.fireRef.$id, $scope.i.file64).then(() => {
//                        $scope.closeModal();
//
////               var key = _.keys($scope.fireRef)[0];
//
//                    });
//                }
            }

            var realImageWidth:number, realImageHeight:number, scaledImageWidth:number, scaledImageHeight:number;

            $scope.setInitialImageProp = (width:number, height:number) => {
                $scope.realImageWidth = width;
                $scope.realImageHeight = height;
                $scope.isCropNeeded = !!( $scope.realImageWidth > $scope.width || $scope.realImageHeight > $scope.height );

            }
            $scope.setScaledImageProp = (width:number) => {
                $scope.scaledImageWidth = width;
                $scope.scaledCoefficient = $scope.scaledImageWidth / $scope.realImageWidth;

                $scope.scaledImageWidth = width;
                $scope.scaledImageHeight = Math.floor($scope.scaledCoefficient * $scope.realImageHeight);

                $scope.scaledCropWidth = Math.floor($scope.scaledCoefficient * parseInt($scope.width));
                $scope.scaledCropHeight = Math.floor($scope.scaledCoefficient * $scope.height);
            }
        },
        link: (scope, elem, attrs:ng.IAttributes) => {
            scope.cutImage = () => {
                var canvas:any = document.getElementById('myCanvas');

                canvas.style.width = scope.width + "px";
                canvas.style.height = scope.height + "px";

                var context = canvas.getContext('2d');
                var imageObj = new Image();

                imageObj.onload = function () {
                    // draw cropped image
                    var cf = scope.scaledCoefficient;
                    var sourceX = scope.x / cf;
                    var sourceY = scope.y / cf;
                    var sourceWidth = scope.w / cf;
                    var sourceHeight = scope.h / cf;

                    var destWidth = scope.width;
                    var destHeight = scope.height;

                    var destX = 0;
                    var destY = 0;

                    context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

                    scope.$apply(()=> {
                        scope.i.file64 = canvas.toDataURL('image/jpeg', 0.6);
                        scope.hasBeenCropped = true;
                        scope.i.isSized = true;
                    })
                };
                scope.cropAccept = false;
                imageObj.src = scope.i.file64;
            }
            scope.crop = () => {
                scope.cropAccept = true;
                scope.img = $('#cropme');

                scope.jcrop_api = scope.img.Jcrop({
                    onChange: (c:any)=> {
                        scope.x = c.x;
                        scope.y = c.y;
                        scope.w = c.w;
                        scope.h = c.h;
                    },
                    setSelect: [0, 0, scope.width, scope.height],
                    aspectRatio: scope.width / scope.height
                });
            }
        }
    }
}
