var oquoControllers = angular.module('oquoControllers');


//User
oquoControllers.controller('MeEditCtrl', ['$scope', '$location', 'User', 'Upload',
    function ($scope, $location, User, Upload) {
        $scope.hasError = function () {
            if (!$scope.file && !$scope.user.PhotoUrl) {
                $scope.errorMessage = 'Choose photo.';
                return true;
            }

            if ($scope.user.FirstName == '') {
                $scope.errorMessage = 'Enter firstname.';
                return true;
            }

            if ($scope.user.LastName == '') {
                $scope.errorMessage = 'Enter lastname.';
                return true;
            }
            return false;
        };

        $scope.user = User.getWithLoginId();

        $scope.submit = function () {
            if ($scope.hasError()) {
                $('#errorModal').modal('show');
                return;
            }
            User.update({ userId: $scope.user.Id }, $scope.user, function (response) {
                if ($scope.file) {
                    $scope.uploadImage($scope.user.Id, $scope.file, function () {
                        $location.path('quote');
                    });
                }
                else {
                    $location.path('quote');
                }
            });
        };

        $scope.uploadImage = function (userId, file, callback) {
            Upload.upload({
                url: 'api/user/' + userId + '/photo',
                data: { file: file }
            }).then(function (response) {
                console.log('Success');
                callback();
            });
        };
    }]);


oquoControllers.controller('MeCtrl', ['$scope', '$location', 'User',
    function ($scope, $location, User) {
        User.getWithLoginId(function (response) {
            $scope.user = User.get({ userId: response.Id });

            $scope.edit = function () {
                $location.path('me/edit');
            };
        });
        
    }]);

oquoControllers.controller('UserListCtrl', ['$scope', 'User',
    function ($scope, User) {
        $scope.key = '';
        $scope.users = User.query();

        $scope.search = function () {
            //$scope.users = User.query({ key: $scope.key });
        };
    }]);

oquoControllers.controller('UserDetailCtrl', ['$scope', '$routeParams', '$location', 'User', 'Follow',
    function ($scope, $routeParams, $location, User, Follow) {
        $scope.userId = $routeParams.userId;

        $scope.user = User.get({ userId: $scope.userId });
        $scope.updateFollowerCount = function () {
            Follow.getFollowerCount({ userId: $scope.userId }, function (response) {
                $scope.user.FollowerCount = response.count;
            });
        };

        $scope.follow = function () {
            Follow.follow({ userId: $scope.userId }, function (response) {
                $scope.user.IsFollowed = true;
                $scope.updateFollowerCount();
            });
        };

        $scope.unfollow = function () {
            Follow.unfollow({ userId: $scope.userId }, function (response) {
                $scope.user.IsFollowed = false;
                $scope.updateFollowerCount();
            });
        };

        $scope.edit = function () {
            $location.path('me/edit');
        };

    }]);


