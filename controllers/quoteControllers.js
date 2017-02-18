var oquoControllers = angular.module('oquoControllers');



//Quote
oquoControllers.controller('QuoteNewCtrl', ['$scope', '$location', 'Quote', 'Book', 'Upload',
    function ($scope, $location, Quote, Book, Upload) {

        $scope.quoteText = '';

        var bookDropdown = $("#bookDropdown");
        bookDropdown.on("select2:select", function (e) {
            $scope.selectedBook = e.params.data;
        });

        bookDropdown.on("select2:unselect", function (e) {
            $scope.selectedBook = null;
        });
        
       
        bookDropdown.select2({
            placeholder: 'Find Book',
            delay: 250,
            minimumInputLength: 1,
            ajax:{
                transport: function (params, success, failure) {
                    Book.query({ key: params.data.term }, success, failure);
                },
                processResults: function (data) {
                    data.data.forEach(function (book) {
                        book.id = book.Id;
                    });
                    return {
                        results: data.data
                    };
                }
            }
            ,
            escapeMarkup: function(m) {
                return m;
            },
            templateResult: function (book) {
                if (book.loading) {
                    return book.text;
                }
                var html = '<div>' +
                            '<img class="book-image" src=\"' + book.PhotoUrl + '\"/>' +
                            book.Title +
                            '</div>';
                return html;
            },
            templateSelection: function (book) {
                if (book.id == '') {
                    return book.text;
                }

                return book.Title;
            }
        });

        $scope.hasError = function () {
            if (!$scope.file){
                $scope.errorMessage = 'Choose photo.';
                return true;
            }

            if ($scope.quoteText == '') {
                $scope.errorMessage = 'Enter quote text.';
                return true;
            }

            if (!$scope.selectedBook) {
                $scope.errorMessage = 'Select book.';
                return true;
            }
            return false;
        };


        $scope.submit = function () {
            if ($scope.hasError()) {
                $('#errorModal').modal('show');
                return;
            }

            var quote = {
                Text: $scope.quoteText,
                BookId: $scope.selectedBook.Id
            };

            $scope.quote = Quote.save(quote, function (response) {
                if ($scope.file) {
                    $scope.uploadImage(response.Id, $scope.file, function () {
                        $location.path('quote');
                    });
                } else {
                    $location.path('quote');
                }
            });
        };

        $scope.uploadImage = function (quoteId, file, callback) {
            Upload.upload({
                url: 'api/quote/' + quoteId + '/photo',
                data: { file: file }
            }).then(function (response) {
                console.log('Success');
                callback();
            });
        };
    }]);

oquoControllers.controller('QuoteListCtrl', ['$scope', 'Quote', 'Comment', 'QuoteComment',
    function ($scope, Quote, Comment, QuoteComment) {
        $scope.quotes = Quote.query({ key: '' });

        //like
        $scope.like = function (quote) {
            Quote.like({ quoteId: quote.Id }, function (response) {
                quote.IsLiked = true;
                $scope.updateLikeCount(quote);
            });
        };

        $scope.dislike = function (quote) {
            Quote.dislike({ quoteId: quote.Id }, function (response) {
                quote.IsLiked = false;
                $scope.updateLikeCount(quote);
            });
        };

        $scope.updateLikeCount = function (quote) {
            Quote.getLikeCount({ quoteId: quote.Id }, function (response) {
                quote.LikeCount = response.count;
            });
        };


        //report
        $scope.report = function (quote) {
            Quote.report({ quoteId: quote.Id }, function () {
                quote.IsReported = true;
            });
        };

        $scope.unreport = function (quote) {
            Quote.unreport({ quoteId: quote.Id }, function () {
                quote.IsReported = false;
            });
        };


        //comment
        $scope.hasError = function (quote) {
            if (!quote.commentText || quote.commentText == '') {
                $scope.errorMessage = 'Enter comment.';
                return true;
            }

            $scope.errorMessage = '';
            return false;
        };

        $scope.updateCommentCount = function (quote) {
            QuoteComment.getCommentCount({ quoteId: quote.Id }, function (response) {
                quote.CommentCount = response.count;
            });
        };

        $scope.updateComments = function (quote) {
            quote.Comments = QuoteComment.query({ quoteId: quote.Id, pagingEnabled: true, pageSize: 2, reversed: true });
        };

        $scope.addComment = function (quote) {
            if ($scope.hasError(quote)) {
                $('#errorModal').modal('show');
                return;
            }

            var comment = {
                Text: quote.commentText,
                QuoteId: quote.Id
            };

            Comment.save(comment, function (response) {
                quote.commentText = '';
                $scope.updateComments(quote);
                $scope.updateCommentCount(quote);
            });
        };
    }]);


oquoControllers.controller('QuoteEditCtrl', ['$scope', '$location', '$routeParams', 'Quote', 'Upload',
    function ($scope, $location, $routeParams, Quote, Upload) {
        $scope.quote = Quote.get({ quoteId: $routeParams.quoteId });

        $scope.submit = function () {
            $scope.quote = Quote.update({ quoteId: $scope.quote.Id }, $scope.quote, function (response) {
                if ($scope.file) {
                    $scope.uploadImage($scope.quote.Id, $scope.file, function () {
                        $location.path('quote/' + $scope.quote.Id);
                    });
                } else {
                    $location.path('quote/' + $scope.quote.Id);
                }
            });
        };

        $scope.uploadImage = function (quoteId, file, callback) {
            Upload.upload({
                url: 'api/quote/' + quoteId + '/photo',
                data: { file: file }
            }).then(function (response) {
                console.log('Success');
                callback();
            });
        };
    }]);

oquoControllers.controller('QuoteDeleteCtrl', ['$scope', '$routeParams', '$location', 'Quote',
    function ($scope, $routeParams, $location, Quote) {
        $scope.quote = Quote.get({ quoteId: $routeParams.quoteId });

        $scope.submit = function () {
            Quote.delete({ quoteId: $scope.quote.Id }, function () {
                $location.path("quote");
            });
        };
    }]);