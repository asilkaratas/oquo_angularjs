var oquoServices = angular.module('oquoServices', ['ngResource']);

//Report
oquoServices.factory('QuoteReport', ['$resource',
    function ($resource) {
        return $resource('api/quotereport/:reportId/:action', {reportId:'@reportId'}, {
            query: { method: 'GET', params: {}, isArray: true },
            cancelReport: { method: 'POST', params: { action: "cancel" } },
            acceptReport: { method: 'POST', params: { action: "accept" } }
        });
    }]);


//User
oquoServices.factory('User', ['$resource',
    function ($resource) {
        return $resource('api/user/:userId', {}, {
            query: { method: 'GET', params: {}, isArray: true },
            update: { method: 'PUT' },
            getWithLoginId: { method: 'GET', params: { userId: 'loginId' } },
            isAdmin: { method: 'GET', params: {userId:'isAdmin'}}
        });
    }]);


//Author
oquoServices.factory('Author', ['$resource',
    function ($resource) {
        return $resource('api/author/:authorId', {}, {
            query: { method: 'GET', params: {}, isArray: false },
            update: { method: 'PUT' },
            getUnapproved: { method: 'GET', params: { authorId: 'unapproved' }, isArray: true },
            approve: { method: 'POST', params: {authorId: 'approve'}}
        });
    }]);

oquoServices.factory('AuthorBookSearch', ['$resource',
    function ($resource) {
        return $resource('api/author/:authorId/book', {}, {
            query: { method: 'GET', params: {}, isArray: true },
            update: { method: 'PUT' }
        });
    }]);

//Book
oquoServices.factory('Book', ['$resource',
    function ($resource) {
        return $resource('api/book/:bookId', {}, {
            query: { method: 'GET', params: {}, isArray: false },
            update: { method: 'PUT' },
            getUnapproved: { method: 'GET', params: { bookId: 'unapproved' }, isArray: true },
            approve: { method: 'POST', params: { bookId: 'approve' } }
        });
    }]);

//Comment
oquoServices.factory('Comment', ['$resource',
    function ($resource) {
        return $resource('api/comment/:commentId', {}, {
            query: { method: 'GET', params: {}, isArray: true },
            update: { method: 'PUT' }
        });
    }]);

oquoServices.factory('QuoteComment', ['$resource',
    function ($resource) {
        return $resource('api/quote/:quoteId/comment/:action', { quoteId: '@quoteId' }, {
            query: { method: 'GET', params: {}, isArray: true },
            getCommentCount: { method: 'GET', params: { action: 'count' } }
        });
    }]);

//Quote
oquoServices.factory('Quote', ['$resource',
    function ($resource) {
        return $resource('api/quote/:quoteId/:action', { quoteId: '@quoteId' }, {
            query: { method: 'GET', params: {}, isArray: true },
            update: { method: 'PUT' },
            likes: { method: 'GET', params: { action: 'like' }, isArray: true },
            like: { method: 'POST', params: { action: 'like' } },
            dislike: { method: 'DELETE', params: { action: 'like' } },
            getLikeCount: { method: 'GET', params: { action: 'like/count' } },
            report: { method:'POST', params: { action: 'report' } },
            unreport: { method: 'DELETE', params: { action: 'report' } }

        });
    }]);

//Follow
oquoServices.factory('Follow', ['$resource',
    function ($resource) {
        return $resource('api/user/:userId/:action', {userId:'@userId'}, {
            follow: { method: 'POST', params: {action:'follow'} },
            unfollow: { method: 'DELETE', params: {action:'follow' } },
            getFollowerCount: { method: 'GET', params: { action: 'follower/count' } },
            getFollowingCount: { method: 'GET', params: { action: 'following/count' } },
            getFollower: { method: 'GET', params: { action: 'follower' }, isArray:true },
            getFollowing: { method: 'GET', params: { action: 'following' }, isArray: true }
        });
    }]);

//Register
oquoServices.factory('Register', ['$resource',
    function ($resource) {
        return $resource('api/account/register', {}, {});
    }]);


//Login
oquoServices.factory('Login', ['$resource',
    function ($resource) {
        return $resource('token', {}, {});
    }]);

oquoServices.factory('Logout', ['$resource',
    function ($resource) {
        return $resource('api/account/Logout', {}, {});
    }]);

oquoServices.factory('LoginService', ['Login', 'Logout', 'localStorageService',
    function (Login, Logout, localStorageService) {
        var loginState = { isLoggedIn: false };
        return {
            login: function (loginData, onSuccess, onError) {
                var loginString = 'grant_type=password&username=' + loginData.Username + '&password=' + loginData.Password;

                Login.save(loginString, function (response) {
                    localStorageService.set('authData', { token: response.access_token });
                    loginState.isLoggedIn = true;

                    if (onSuccess) {
                        onSuccess(response);
                    }
                }, function (response) {
                    if (onError) {
                        onError(response);
                    }
                });
            },

            logout: function (callback) {
                Logout.save(function () {
                    localStorageService.set('authData', null);
                    loginState.isLoggedIn = false;

                    if (callback) {
                        callback();
                    }
                });
            },
            
            getLoginState: function () {
                loginState.isLoggedIn = localStorageService.get('authData') != null;
                return loginState;
            }
        };
    }]);