var oquoControllers = angular.module('oquoControllers');


//AuthorController
oquoControllers.controller('AuthorNewCtrl', ['$scope', '$location', 'Author', 'Upload',
    function ($scope, $location, Author, Upload) {

        $scope.author = {
            FirstName: '',
            LastName: ''
        };

        $scope.hasError = function () {
            if (!$scope.file) {
                $scope.errorMessage = 'Choose photo.';
                return true;
            }

            if ($scope.author.FirstName == '') {
                $scope.errorMessage = 'Enter firstname.';
                return true;
            }

            if ($scope.author.LastName == '') {
                $scope.errorMessage = 'Enter lastname.';
                return true;
            }
            return false;
        };

        $scope.submit = function () {
            if ($scope.hasError()) {
                $('#errorModal').modal('show');
                return;
            }

            $scope.author = Author.save($scope.author, function (response) {
                if ($scope.file) {
                    $scope.uploadImage(response.Id, $scope.file, function () {
                        $scope.locateToNewBook();
                    });
                } else {
                    $scope.locateToNewBook();
                }
            });
        };

        $scope.locateToNewBook = function () {
            $location.path('book/new');
        };

        $scope.uploadImage = function (authorId, file, callback) {
            Upload.upload({
                url: 'api/author/' + authorId + '/photo',
                data: { file: file }
            }).then(function (response) {
                console.log('Success');
                callback();
            });
        };
    }]);


oquoControllers.controller('AuthorListCtrl', ['$scope', '$routeParams', 'Author',
    function ($scope, $routeParams, Author) {
        $scope.key = $routeParams.key;

        $scope.search = function () {
            $scope.authors = Author.query({ key: $scope.key, maxResults: 122 });
        };
    }]);

oquoControllers.controller('AuthorDetailCtrl', ['$scope', '$routeParams', 'Author', 'AuthorBookSearch',
    function ($scope, $routeParams, Author, AuthorBookSearch) {
        $scope.author = Author.get({ authorId: $routeParams.authorId });

        $scope.key = $routeParams.key;

        $scope.search = function () {
            $scope.books = AuthorBookSearch.query({ authorId: $routeParams.authorId, key: $scope.key });
        };
    }]);

oquoControllers.controller('AuthorEditCtrl', ['$scope', '$location', '$routeParams', 'Author', 'Upload',
    function ($scope, $location, $routeParams, Author, Upload) {
        $scope.author = Author.get({ authorId: $routeParams.authorId });

        $scope.submit = function () {
            $scope.author = Author.update({ authorId: $scope.author.Id }, $scope.author, function (response) {
                if ($scope.file) {
                    $scope.uploadImage($scope.author.Id, $scope.file, function () {
                        $location.path('author/' + $scope.author.Id);
                    });
                } else {
                    $location.path('author/' + $scope.author.Id);
                }
            });
        };

        $scope.uploadImage = function (authorId, file, callback) {
            Upload.upload({
                url: 'api/author/' + authorId + '/photo',
                data: { file: file }
            }).then(function (response) {
                console.log('Success');
                callback();
            });
        };
    }]);

oquoControllers.controller('AuthorDeleteCtrl', ['$scope', '$routeParams', '$location', 'Author',
    function ($scope, $routeParams, $location, Author) {
        $scope.author = Author.get({ authorId: $routeParams.authorId });

        $scope.submit = function () {
            Author.delete({ authorId: $scope.author.Id }, function () {
                $location.path("author");
            });
        };
    }]);


