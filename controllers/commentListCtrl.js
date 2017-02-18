var oquoControllers = angular.module('oquoControllers');

//Comment
oquoControllers.controller('CommentListCtrl', ['$scope', '$routeParams', 'QuoteComment',
    function ($scope, $routeParams, QuoteComment) {
        $scope.quoteId = $routeParams.quoteId;

        $scope.comments = QuoteComment.query({ quoteId: $scope.quoteId });
    }]);
