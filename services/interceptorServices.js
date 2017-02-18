var interceptorServices = angular.module('interceptorServices', []);

interceptorServices.factory('authInterceptorService', ['$q', '$location', 'localStorageService',
    function ($q, $location, localStorageService) {
        return {
            request: function (config) {
                var authData = localStorageService.get('authData');
                if (authData) {
                    config.headers.Authorization = 'Bearer ' + authData.token;
                }
                return config;
            },

            responseError: function (rejection) {
                if (rejection.status === 401) {
                    $location.path('/login');
                }
                return $q.reject(rejection);
            }
        };
    }]);