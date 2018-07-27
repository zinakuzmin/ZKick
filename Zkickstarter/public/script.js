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
                var updatedProjects = updateProjects(response.data);
                $scope.projects = updatedProjects;
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
                    if ($scope.project.status == "Active")
                        return "twitter.tpl.html";
                }
            }
        };
    });

function updateProjects(projects){

    for (var i=0; i < projects.length; i++){

        var percentage = calculatePercentage(projects[i].requestedAmountOfMoney, projects[i].donated);
        projects[i]['percentageText'] = percentage + "%";
        if (percentage > 100)
            projects[i]['percentageToShow'] = 100 + "%";
        else
            projects[i]['percentageToShow'] = percentage + "%";
        var time = timeRemaining(projects[i].endDate);
        projects[i]['timeRemaining'] = time;
    }
    return projects;
}

function calculatePercentage(required, donated){
    var percentage = 0;
    if (donated && required){
        if (!isNaN(donated) && !isNaN(required))
            percentage = (Number(donated) * 100) / Number(required);
    }
    return Math.round(percentage)
}

function timeRemaining(endDate) {

    var countDownDate = new Date(endDate).getTime();
    // Get todays date and time
    var now = new Date().getTime();
    // Find the distance between now an the count down date
    var distance = countDownDate - now;
    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    if (distance < 0) {
        return "EXPIRED"
    }
    return "Time Left: " + days + "d " + hours + "h " + minutes + "m "
}




