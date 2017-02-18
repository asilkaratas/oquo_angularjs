var oquoControllers = angular.module('oquoControllers');

oquoControllers.controller('RegisterCtrl', ['$scope', '$location', 'Register', 'Upload',
    function ($scope, $location, Register, Upload) {

        $scope.registerData = {
            Email: "t@t.com",
            Password: 'P@ssword1!',
            ConfirmPassword: 'P@ssword1!'
        };

        $scope.submit = function () {
            Register.save($scope.registerData, function (response) {
                $location.path('login');
            }, function (response) {
                $scope.errorMessage = 'Check email and password!';
                $('#errorModal').modal('show');
            });
        };
    }]);