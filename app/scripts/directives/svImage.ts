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

            width: '=',
            height: '=',

            onFileSelect: '&'
        },
        controller($scope) {

            var realImageWidth:number, realImageHeight:number, scaledImageWidth:number, scaledImageHeight:number;

            $scope.setInitialImageProp = (width:number, height:number) => {
                $scope.realImageWidth = width;
                $scope.realImageHeight = height;

                $scope.isCropNeeded = ($scope.width < $scope.realImageWidth || $scope.height < $scope.realImageHeight) ? true : false;

            }
            $scope.setScaledImageProp = (width:number) => {
                $scope.scaledImageWidth = width;
                $scope.scaledCoefficient = $scope.scaledImageWidth / $scope.realImageWidth;

                $scope.scaledImageWidth = width;
                $scope.scaledImageHeight = Math.floor($scope.scaledCoefficient * $scope.realImageHeight);

                $scope.scaledCropWidth = Math.floor($scope.scaledCoefficient * parseInt($scope.width));
                $scope.scaledCropHeight = Math.floor($scope.scaledCoefficient * $scope.height);

//                console.log($scope.scaledCropHeight);
            }

        },
        link: (scope, elem, attrs:ng.IAttributes) => {
            scope.cutImage = () => {
//                scope.isCropNeeded = false;
//                console.log('I am herer');
                elem.remove('canvas');
                var canvas = document.createElement('canvas');
//                elem.prepend(canvas);

                var context = canvas.getContext('2d');
                var imageObj = new Image();

                imageObj.onload = function () {
                    // draw cropped image
                    var sourceX = scope.x / scope.scaledCoefficient;
                    var sourceY = scope.y / scope.scaledCoefficient;
                    var sourceWidth = scope.width;
                    var sourceHeight = scope.height;

                    var destWidth = sourceWidth;
                    var destHeight = sourceHeight;
                    var destX = 0;
                    var destY = 0;

                    context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

                    scope.$apply(()=> {
                        scope.i.file64 = canvas.toDataURL('jpg');
                        scope.i.isSized = true;
                    })
                };
                scope.realImageWidth = scope.width;
                scope.realImageHeight = scope.height;
                scope.cropAccept = false;
                scope.element.remove();

                scope.hasBeenCropped = true;
//                    console.log(imageObj);
                imageObj.src = scope.i.file64;
            }
            scope.crop = () => {
                scope.cropAccept = true;
                console.log(scope.scaledCropWidth);
                console.log(scope.scaledCropHeight);
                scope.element = angular.element('<div></div>');

                var startX = 0, startY = 0;
                scope.x = 0;
                scope.y = 0;
                scope.element.css({
                    position: 'absolute',
                    opacity: 0.7,
                    left: '0px',
                    top: '0px',
                    border: '1px solid red',
                    backgroundColor: 'lightgrey',
                    cursor: 'pointer',
                    width: scope.scaledCropWidth + 'px',
                    height: scope.scaledCropHeight + 'px'
                });

                scope.element.on('mousedown', function (event) {
                    // Prevent default dragging of selected content
                    event.preventDefault();
                    startX = event.pageX - scope.x;
                    startY = event.pageY - scope.y;
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                });

                function mousemove(event) {
                    scope.y = event.pageY - startY;
                    scope.x = event.pageX - startX;
                    if (scope.y < 0) {
                        scope.y = 0;
                    }
                    if (scope.x < 0) {
                        scope.x = 0;
                    }

                    if (scope.x + scope.scaledCropWidth > scope.scaledImageWidth) {
                        scope.x = scope.scaledImageWidth - scope.scaledCropWidth;
                    }

                    if (scope.y + scope.scaledCropHeight > scope.scaledImageHeight) {
                        scope.y = scope.scaledImageHeight - scope.scaledCropHeight;
                    }

                    scope.element.css({
                        top: scope.y + 'px',
                        left: scope.x + 'px'
                    });
                }

                function mouseup() {
                    $document.off('mousemove', mousemove);
                    $document.off('mouseup', mouseup);
                }


                $compile(scope.element)(scope);

                var imgDiv = elem.find('img').parent();
                imgDiv.append(scope.element);
            }

        }
    }
}