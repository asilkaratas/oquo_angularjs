var oquoControllers = angular.module('oquoControllers');

oquoControllers.controller('HeaderCtrl', ['$scope', '$location', 'LoginService',
    function ($scope, $location, LoginService) {

        $scope.loginState = LoginService.getLoginState();

        $scope.logout = function () {
            LoginService.logout(function () {
                $location.path('login');
            });
        };

        $scope.newQuote = function () {
            $location.path('quote/new');
        };

        $scope.showFeed = function () {
            $location.path('quote');
        };
    }]);