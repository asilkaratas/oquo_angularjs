var oquoControllers = angular.module('oquoControllers');

oquoControllers.controller('LoginCtrl', ['$scope', '$location', 'LoginService', 'User',
    function ($scope, $location, LoginService, User) {

        $scope.loginData = {
            Username: 't@t.com',
            Password: 'P@ssword1!'
        };

        $scope.submit = function () {
            $scope.serverError = false;
            LoginService.login($scope.loginData, function (response) {
                User.getWithLoginId(function (response) {
                    if (!response.FirstName) {
                        $location.path('me/edit');
                    } else {
                        $location.path('quote');
                    }
                });
                
            }, function (response) {
                $scope.errorMessage = 'Check email and password!';
                $('#errorModal').modal('show');
            });
        };

        if (LoginService.getLoginState().isLoggedIn) {
            LoginService.logout();
        }
    }]);
