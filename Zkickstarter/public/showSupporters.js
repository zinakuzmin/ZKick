angular.module("projectViewerApp", [])


    .controller("projectViewerController", function($scope, $http){
        var urlParams = new URLSearchParams(window.location.search);
        var projectID = urlParams.get('id');
        $http.get('getProjectSupporters', {
            params:   {projectID: projectID}
        })
            .then(function(response) {
                $scope.supporters = response.data.data;
            })
    })

    .directive("supporters", function() {
        return {
            scope: {
                supporter: '=data'
            },
            restrict: 'E',
        };
    });




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





