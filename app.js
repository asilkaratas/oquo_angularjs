var oquoApp = angular.module('oquoApp', ['ngRoute', 'ngFileUpload', 'LocalStorageModule', 'oquoControllers', 'oquoFilters', 'oquoServices', 'interceptorServices']);
var oquoControllers = angular.module('oquoControllers', []);

oquoApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
        when('/login', {
            templateUrl: 'app/views/login.html',
            controller: 'LoginCtrl'
        }).
        when('/register', {
            templateUrl: 'app/views/register.html',
            controller: 'RegisterCtrl'
        }).
        when('/me/edit', {
            templateUrl: 'app/views/user-edit.html',
            controller: 'MeEditCtrl'
        }).
        when('/me', {
            templateUrl: 'app/views/user-detail.html',
            controller: 'MeCtrl'
        }).
        when('/user/:userId', {
            templateUrl: 'app/views/user-detail.html',
            controller: 'UserDetailCtrl'
        }).
        //Author
        when('/author/new', {
            templateUrl: 'app/views/author-new.html',
            controller: 'AuthorNewCtrl'
        }).
        //book
        when('/book/new', {
            templateUrl: 'app/views/book-new.html',
            controller: 'BookNewCtrl'
        }).
        when('/book/:bookId', {
            templateUrl: 'app/views/book-detail.html',
            controller: 'BookDetailCtrl'
        }).
        //Quote
        when('/quote', {
            templateUrl: 'app/views/quote-list.html',
            controller: 'QuoteListCtrl'
        }).
        when('/quote/new', {
            templateUrl: 'app/views/quote-new.html',
            controller: 'QuoteNewCtrl'
        }).
        //Comment
        when('/quote/:quoteId/comment', {
            templateUrl: 'app/views/comment-list.html',
            controller: 'CommentListCtrl'
        }).
        otherwise({
            redirectTo: '/login'
        });
    }]);




oquoApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});