var oquoControllers = angular.module('oquoControllers');

//Book
oquoControllers.controller('BookListCtrl', ['$scope', 'Book',
    function ($scope, Book) {
        $scope.key = '';

        $scope.search = function () {
            $scope.books = Book.query({ key: $scope.key });
        };
    }]);

oquoControllers.controller('BookNewCtrl', ['$scope', '$location', 'Book', 'Author', 'Upload',
    function ($scope, $location, Book, Author, Upload) {
        $scope.book = {
            Title: '',
            PublishedYear: ''
        };

        var authorDropdown = $("#authorDropdown");
        authorDropdown.on("select2:select", function (e) {
            $scope.selectedAuthor = e.params.data;
        });

        authorDropdown.on("select2:unselect", function (e) {
            $scope.selectedAuthor = null;
        });

        authorDropdown.select2({
            placeholder: 'Find Author',
            delay: 250,
            minimumInputLength: 1,
            ajax: {
                transport: function (params, success, failure) {
                    Author.query({ key: params.data.term }, success, failure);
                },
                processResults: function (data) {
                    data.data.forEach(function (author) {
                        author.id = author.Id;
                    });
                    return {
                        results: data.data
                    };
                }
            }
            ,
            escapeMarkup: function (m) {
                return m;
            },
            templateResult: function (author) {
                if (author.loading) {
                    return author.text;
                }
                var html = '<div>' +
                            '<img class="author-image" src=\"' + author.PhotoUrl + '\"/>' +
                            author.FirstName + ' ' + author.LastName +
                            '</div>';
                return html;
            },
            templateSelection: function (author) {
                if (author.id == '') {
                    return author.text;
                }

                return author.FirstName + ' ' + author.LastName;
            }
        });
        
        

        $scope.hasError = function () {
            if (!$scope.file) {
                $scope.errorMessage = 'Choose photo.';
                return true;
            }

            if ($scope.book.Title == '') {
                $scope.errorMessage = 'Enter title.';
                return true;
            }

            if ($scope.book.PublishedYear == '' || $scope.book.PublishedYear < 1700 || $scope.book.PublishedYear > 2016) {
                $scope.errorMessage = 'Enter published year 1700< x < 2017.';
                return true;
            }

            if (!$scope.selectedAuthor) {
                $scope.errorMessage = 'Select author';
                return true;
            }

            $scope.errorMessage = '';
            return false;
        };

        $scope.submit = function () {
            if ($scope.hasError()) {
                $('#errorModal').modal('show');
                return;
            }

            $scope.book.AuthorId = $scope.selectedAuthor.Id;
                
            $scope.book = Book.save($scope.book, function (response) {
                if ($scope.file) {
                    $scope.uploadImage(response.Id, $scope.file, function () {
                        $scope.locateToNewQuote();
                    });
                } else {
                    $scope.locateToNewQuote();
                }
            });
        };

        $scope.locateToNewQuote = function () {
            $location.path('/quote/new');
        };

        $scope.uploadImage = function (bookId, file, callback) {
            Upload.upload({
                url: 'api/book/' + bookId + '/photo',
                data: { file: file }
            }).then(function (response) {
                console.log('Success');
                callback();
            });
        };
        
    }]);

oquoControllers.controller('BookDetailCtrl', ['$scope', '$routeParams', 'Book',
    function ($scope, $routeParams, Book) {
        $scope.book = Book.get({ bookId: $routeParams.bookId });

    }]);

oquoControllers.controller('BookEditCtrl', ['$scope', '$location', '$routeParams', 'Book', 'Upload',
    function ($scope, $location, $routeParams, Book, Upload) {
        $scope.book = Book.get({ bookId: $routeParams.bookId });

        $scope.submit = function () {
            $scope.book = Book.update({ bookId: $scope.book.Id }, $scope.book, function (response) {
                if ($scope.file) {
                    $scope.uploadImage($scope.book.Id, $scope.file, function () {
                        $location.path('book/' + $scope.book.Id);
                    });
                } else {
                    $location.path('book/' + $scope.book.Id);
                }
            });
        };

        $scope.uploadImage = function (bookId, file, callback) {
            Upload.upload({
                url: 'api/book/' + bookId + '/photo',
                data: { file: file }
            }).then(function (response) {
                console.log('Success');
                callback();
            });
        };
    }]);

oquoControllers.controller('BookDeleteCtrl', ['$scope', '$routeParams', '$location', 'Book',
    function ($scope, $routeParams, $location, Book) {
        $scope.book = Book.get({ bookId: $routeParams.bookId });

        $scope.submit = function () {
            Book.delete({ bookId: $scope.book.Id }, function () {
                $location.path("book");
            });
        };
    }]);