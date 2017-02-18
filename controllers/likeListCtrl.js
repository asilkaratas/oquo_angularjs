var oquoControllers = angular.module('oquoControllers');

//Like
oquoControllers.controller('LikeListCtrl', ['$scope', '$routeParams', 'Quote',
    function ($scope, $routeParams, Quote) {
        $scope.quoteId = $routeParams.quoteId;

        $scope.likes = Quote.likes({ quoteId: $scope.quoteId });
    }]);