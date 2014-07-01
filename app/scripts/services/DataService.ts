class DataService {
    constructor(public $http:ng.IHttpService, public $q:ng.IQService) {
    }

    getProfile<T>(id:string) {
        var d = this.$q.defer<T>();

        this.$http.post('http://localhost:44300/BreederPersonal/GetProfile', {id: id}).success((result:T) => {

            d.resolve(result);
        }).error((data, error) => {
            // console.log(data)
            // console.log(error)
            d.reject();
        });
        return d.promise;
    }

    getLitters<T>() {
        var d = this.$q.defer<T[]>();

        this.$http.get('http://localhost:44300/BreederPersonal/GetLitters').success((result:T[]) => {

            d.resolve(result);
        }).error((data, error) => {
            // console.log(data)
            // console.log(error)
            d.reject();
        });
        return d.promise;
    }

    getFeedbacks<T>() {
        var d = this.$q.defer<T[]>();

        this.$http.get('http://localhost:44300/BreederPersonal/GetFeedbacks').success((result:T[]) => {

            d.resolve(result);
        }).error((data, error) => {
            // console.log(data)
            // console.log(error)
            d.reject();
        });
        return d.promise;
    }

    updateProfile<T>(t:T) {
        var d = this.$q.defer<T>();

        this.$http.post('http://localhost:44300/BreederPersonal/UpdateUserProfile', {BreederViewModel: t})
            .success(() => {
                d.resolve();
            }).error((data, error) => {
                // console.log(data)
                // console.log(error)
                d.reject();
            });
        return d.promise;
    }

    deletePhoto(galleryId:number, photoId:number) {
        var d = this.$q.defer();

        this.$http.post('http://localhost:44300/BreederPersonal/DeletePhoto', {
            deletePhoto: {
                GalleryId: galleryId,
                PhotoId: photoId
            }})
            .success(() => {
                d.resolve();
            }).error(() => {
                d.reject();
            });
        return d.promise;
    }

    saveNewLitters<T>(litters:Litter[]) {

        var d = this.$q.defer<T[]>();

        this.$http.post('http://localhost:44300/BreederPersonal/SaveNewLitters', {
            litters: litters

        })
            .success(() => {
                d.resolve();
            }).error(() => {
                d.reject();
            });
        return d.promise;
    }

    saveNewTestimonials<T>(feedbacks:IFeedback[]) {

        var d = this.$q.defer<T[]>();
        console.log(feedbacks);
        this.$http.post('http://localhost:44300/BreederPersonal/SaveNewFeedbacks', {
            feedbacks: feedbacks
        })
            .success((result:T[]) => {
                d.resolve(result);
            }).error(() => {
                d.reject();
            });
        return d.promise;
    }

    deleteLitterPhoto(galleryId:number, photoId:number) {
        var d = this.$q.defer();

        this.$http.post('http://localhost:44300/BreederPersonal/DeleteLitterPhoto', {
            deletePhoto: {
                GalleryId: galleryId,
                PhotoId: photoId
            }})
            .success(() => {
                d.resolve();
            }).error(() => {
                d.reject();
            });
        return d.promise;
    }

    updateCaption(galleryId:number, photoId:number, caption:string) {
        var d = this.$q.defer();

        this.$http.post('http://localhost:44300/BreederPersonal/UpdateCaption', {
            photoCaption: {
                GalleryId: galleryId,
                PhotoId: photoId,
                Caption: caption
            }})
            .success(() => {
                d.resolve();
            }).error(() => {
                d.reject();
            });
        return d.promise;
    }

    updateTitle(galleryId:number, title:string) {
        var d = this.$q.defer();

        this.$http.post('http://localhost:44300/BreederPersonal/UpdateTitle', {
            galleryTitle: {
                GalleryId: galleryId,
                Title: title
            }})
            .success(() => {
                d.resolve();
            }).error(() => {
                d.reject();
            });
        return d.promise;
    }

    deleteGallery(galleryId:number) {
        var d = this.$q.defer();

        this.$http.post('http://localhost:44300/BreederPersonal/DeleteGallery', {
            galleryId: galleryId
        })
            .success(() => {
                d.resolve();
            }).error(() => {
                d.reject();
            });
        return d.promise;
    }

    shareGallery(galleryId:number) {
        var d = this.$q.defer();

        this.$http.post('http://localhost:44300/BreederPersonal/ShareGallery', {
            galleryId: galleryId
        })
            .success(() => {
                d.resolve();
            }).error(() => {
                d.reject();
            });
        return d.promise;
    }

    updateGallery(gallery:IGallery) {
        var d = this.$q.defer();

        this.$http.post('http://localhost:44300/BreederPersonal/UpdateGallery', {
            gallery: gallery
        })
            .success(() => {
                d.resolve();
            }).error(() => {
                d.reject();
            });
        return d.promise;
    }

    convertNewGalleries(galleries:number[]) {

        var d = this.$q.defer();

        this.$http.post('http://localhost:44300/BreederPersonal/ConvertNewGalleries', {
            galleries: galleries
        })
            .success(() => {
                d.resolve();
            }).error(() => {
                d.reject();
            });
        return d.promise;
    }

    updateLitter(litter:ILitter) {
        var d = this.$q.defer();

        this.$http.post('http://localhost:44300/BreederPersonal/SaveLitter', {
            litter: litter
        })
            .success(() => {
                d.resolve();
            }).error(() => {
                d.reject();
            });
        return d.promise;
    }

    updateFeedback(feedback:IFeedback) {
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
    }

    deleteLitter(id:number) {
        var d = this.$q.defer();

        this.$http.post('http://localhost:44300/BreederPersonal/DeleteLitter', {
            litterId: id
        })
            .success(() => {
                d.resolve();
            }).error(() => {
                d.reject();
            });
        return d.promise;
    }

    deleteFeedback(id:number) {
        var d = this.$q.defer();

        this.$http.post('http://localhost:44300/BreederPersonal/DeleteFeedback', {
            feedbackId: id
        })
            .success(() => {
                d.resolve();
            }).error(() => {
                d.reject();
            });
        return d.promise;
    }

    getGalleries<T>() {
        var d = this.$q.defer<T[]>();

        this.$http.get('http://localhost:44300/BreederPersonal/GetGalleries').success((result:T[]) => {
            d.resolve(result);
        }).error((data, error) => {
            // console.log(data)
            // console.log(error)
            d.reject();
        });
        return d.promise;

    }

    updateGalleries<T>(t:T[]) {
        var d = this.$q.defer<T>();

        this.$http.post('http://localhost:44300/BreederPersonal/UpdateGalleries', {Galleries: t})
            .success(() => {
                d.resolve();
            }).error((data, error) => {
                // console.log(data)
                // console.log(error)
                d.reject();
            });
        return d.promise;
    }
}
