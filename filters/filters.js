angular.module('oquoFilters', []).filter('checkmark', function () {
    return function (input) {
        return input ? '1' : '0';
    };
});