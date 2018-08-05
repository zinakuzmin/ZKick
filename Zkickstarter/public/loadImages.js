// angular.module('projectViewerApp', [])
//     .controller('projectViewerController', ['$scope', function($scope) {
//         $scope.images = [
//             {img_name:"/images/uploads/1532463203998-ScreenHunter38.png"},
//             {img_name:"/images/uploads/1532463203998-ScreenHunter38.png"},
//             {img_name:"/images/uploads/1532463203998-ScreenHunter38.png"},
//             {img_name:"/images/uploads/1532463203998-ScreenHunter38.png"},
//             {img_name:"/images/uploads/1532463203998-ScreenHunter38.png"},
//             {img_name:"/images/uploads/1532463203998-ScreenHunter38.png"}
//             ];
//         // $scope.images = $scope.project.images;
//     }]);
//
//

angular.module("projectViewerApp", [])


    .controller("projectViewerController", function($scope, $http){
        //var projectID = document.getElementById("project_id"); //.textContent;

        var urlParams = new URLSearchParams(window.location.search);
        var projectID = urlParams.get('id');

        $http.get('getProjectImages', {
            params:   {projectID: projectID}
        })
            .then(function(response) {
                // var updatedProjects = updateProjects(response.data);
                $scope.images = response.data.data;
            })
    })

    .directive("profile", function() {
        return {
            // template: '<ng-include src="getTemplateUrl()"/>',
            // //templateUrl: unfortunately has no access to $scope.user.type
            scope: {
                image: '=data'
            },
            restrict: 'E',
            // controller: function($scope) {
            //     //function used on the ng-include to resolve the template
            //     $scope.getTemplateUrl = function() {
            //         //basic handling. It could be delegated to different Services
            //         if ($scope.project.status == "Active")
            //             return "twitter.tpl.html";
            //     }
            // }
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





