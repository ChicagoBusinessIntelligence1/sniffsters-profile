/// <reference path="directives/BreederDetails.ts" />
/// <reference path="filters/BoolString.ts" />
/// <reference path="directives/aboutInfo.ts" />
/// <reference path="directives/aboutInfoEdit.ts" />
/// <reference path="directives/detailsInfo.ts" />
/// <reference path="directives/detailsInfoEdit.ts" />
/// <reference path="directives/previousPuppies.ts" />
/// <reference path="directives/photosInfo.ts" />
/// <reference path="controllers/PhotosCtrl.ts" />
/// <reference path="directives/photoGalleries.ts" />
/// <reference path="filters/SpacesToDashes.ts" />
/// <reference path="directives/photoGallery.ts" />
/// <reference path="directives/photoGalleryEdit.ts" />
/// <reference path="services/GalleryService.ts" />
/// <reference path="filters/TitleLength.ts" />
/// <reference path="directives/spinDiv.ts" />
/// <reference path="filters/GalleryActive.ts" />
/// <reference path="controllers/PuppiesCtrl.ts" />
/// <reference path="directives/litter.ts" />
/// <reference path="directives/litterNew.ts" />
/// <reference path="controllers/TestimonialsCtrl.ts" />
/// <reference path="directives/feedback.ts" />
/// <reference path="directives/feedbackInfo.ts" />
/// <reference path="directives/litterInfo.ts" />
/// <reference path="directives/feedbackEdit.ts" />
/// <reference path="controllers/GenerateCtrl.ts" />
//#ref

var profile = angular.module("profile", ['ui.router', 'angularFileUpload', 'ngAnimate', 'ui.bootstrap.modal', 'ui.bootstrap', 'ui.bootstrap.tpls', 'firebase']);

profile.filter('boolString', () => {
    return (value:boolean):string => {
        return BoolString.filter(value);
    }
});
profile.filter('spacesToDashes', () => {
    return (value:string):string => {
        return SpacesToDashes.filter(value);
    }
});
profile.filter('titleLength', () => {
    return (value:string, len:number):string => {
        return TitleLength.filter(value, len);
    }
});
profile.filter('galleryActive', () => {
    return (Galleries:IGallery[], isActive:Boolean):IGallery[] => {
        return GalleryActive.filter(Galleries, isActive);
    }
});

//#filt

profile.service("CopyProfileService", CopyProfileService);
profile.service("GalleryService", GalleryService);
//#serv

profile.directive("aboutInfoEdit", aboutInfoEdit);
profile.directive("detailsInfo", detailsInfo);
profile.directive("detailsInfoEdit", detailsInfoEdit);
profile.directive("previousPuppies", previousPuppies);
profile.directive("photosInfo", photosInfo);
profile.directive("photoGalleries", photoGalleries);
profile.directive("photoGallery", photoGallery);
profile.directive("photoGalleryEdit", photoGalleryEdit);
profile.directive("spinDiv", spinDiv);
profile.directive("litter", litter);
profile.directive("litterNew", litterNew);
profile.directive("feedback", feedback);
profile.directive("feedbackInfo", feedbackInfo);
profile.directive("litterInfo", litterInfo);
profile.directive("feedbackEdit", feedbackEdit);
//#dir
profile.directive("aboutInfo", aboutInfo);
profile.directive("breederDetails", breederDetails);

profile.controller("PhotosCtrl", PhotosCtrl);
profile.controller("PuppiesCtrl", PuppiesCtrl);
profile.controller("TestimonialsCtrl", TestimonialsCtrl);
profile.controller("GenerateCtrl", GenerateCtrl);
//#ctrl

// TODO: Implement filter
profile.value("toastr", toastr)
profile.service("DataService", DataService);

profile.config(
    ($stateProvider, $urlRouterProvider) => {
        $urlRouterProvider.otherwise("/profile/about");

        $stateProvider
            .state("profile", {
                abstract: true,
                controller: IndexCtrl,
                url: "/profile",
                templateUrl: "../views/profile.html"
            })
            .state("profile.about1", {
                url: "/about",
                templateUrl: "../views/profile-about.html"
            })
            .state("profile.about1.edit", {
                url: "/edit",
                templateUrl: "../views/profile-about-edit.html"
            })
            .state("profile.photos2", {
                url: "/photos",
                resolve: {
                    data: (DataService:DataService) => {
                        return DataService.getGalleries<IGallery>();
                    }
                },

                controller: "PhotosCtrl",
                templateUrl: "../views/profile-photos.html"
            })
            .state("profile.photos2.galleries", {
                url: "/gallery/:id",
                template: "<div ui-view><photo-gallery></photo-gallery></div>"
            })
            .state("profile.photos2.galleries.edit", {
                url: "/edit",
                template: "<photo-gallery-edit></photo-gallery-edit>"
            })
            .state("profile.puppies3", {
                url: "/puppies",
                controller: "PuppiesCtrl",

                templateUrl: "../views/profile-puppies.html"
            })
            .state("profile.puppies3.litter", {
                url: "/litter/:id",
                templateUrl: "../views/profile-puppiesLitter.html"
            })
            .state("profile.puppies3.litter.edit", {
                url: "/edit",
                template: "<litter l='puppies.SelectedLitter' user-name='{{index.Id}}'></litter>"
            })
            .state("profile.details4", {
                url: "/details",
                templateUrl: "../views/profile-details.html"
            })
            .state("profile.details4.edit", {
                url: "/edit",
                templateUrl: "../views/profile-detailsEdit.html"
            })
            .state("profile.testimonials5", {
                url: "/testimonials",
                controller: "TestimonialsCtrl",
                templateUrl: "../views/profile-testimonials.html"
            })
            .state("profile.testimonials5.edit", {
                url: "/edit/:id",
                resolve: {
                    feedbacks: (DataService:DataService) => {
                        return DataService.getFeedbacks<IFeedback>();
                    }
                },
                template: "<feedback-edit></feedback-edit>"
            })
            .state("generate", {
                url: "/generate",
                controller: "GenerateCtrl",
                templateUrl: "../views/generate.html"
            })
//#state
    });

