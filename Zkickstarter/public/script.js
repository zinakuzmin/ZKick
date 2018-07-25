// var app = angular.module('app', ['ngRoute']);
//
// app.config(function($routeProvider) {
//     $routeProvider
//
//         .when('/', {
//             templateUrl : 'twitter.tpl.html',
//             controller  : 'DashboardController'
//         })
//
//         .when('/projects/id', {
//             templateUrl : 'item.tpl.html',
//             controller  : 'ItemController'
//         })
//
//         .otherwise({redirectTo: '/'});
// });
//
// app.controller('DashboardController', function($scope, $http){
//     $http.get("projects")
//         .then(function(response) {
//             $scope.projects = response.data;
//         })
// })
//
//     .directive("profile", function() {
//         return {
//             template: '<ng-include src="getTemplateUrl()"/>',
//             //templateUrl: unfortunately has no access to $scope.user.type
//             scope: {
//                 project: '=data'
//             },
//             restrict: 'E',
//             controller: function($scope) {
//                 //function used on the ng-include to resolve the template
//                 $scope.getTemplateUrl = function() {
//                     //basic handling. It could be delegated to different Services
//                     if ($scope.project.status == "opened")
//                         return "twitter.tpl.html";
//                 }
//             }
//         };
//     });
//
// app.controller('BlogController', function($scope) {
//     $scope.message = 'Hello from BlogController';
// });







angular.module("app", [])


    .controller("DashboardController", function($scope, $http){
        $http.get("projects")
            .then(function(response) {
                $scope.projects = response.data;
            })
    })

    .directive("profile", function() {
        return {
            template: '<ng-include src="getTemplateUrl()"/>',
            //templateUrl: unfortunately has no access to $scope.user.type
            scope: {
                project: '=data'
            },
            restrict: 'E',
            controller: function($scope) {
                //function used on the ng-include to resolve the template
                $scope.getTemplateUrl = function() {
                    //basic handling. It could be delegated to different Services
                    if ($scope.project.status == "opened")
                        return "twitter.tpl.html";
                }
            }
        };
    });



