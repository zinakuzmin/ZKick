angular.module("app", [])


    .controller("Controller", function($scope, $http){
        $http.get("dashboard")
            .then(function(response) {
                $scope.users = response.data.projects;
            })
        // .controller("Controller", function($scope){
        // $scope.users = [
        //     {name: "John", type: "twitter", description: "balbla"},
        //     {name: "Maria" ,type: "facebook"}
        // ];
    })

    .directive("profile", function() {
        return {
            template: '<ng-include src="getTemplateUrl()"/>',
            //templateUrl: unfortunately has no access to $scope.user.type
            scope: {
                user: '=data'
            },
            restrict: 'E',
            controller: function($scope) {
                //function used on the ng-include to resolve the template
                $scope.getTemplateUrl = function() {
                // getTemplateUrl = function() {
                    //basic handling. It could be delegated to different Services
                    // if ($scope.user.type == "twitter")
                    if ($scope.user.name == "project1")
                        return "twitter.tpl.html";
                    if ($scope.user.type == "project2")
                        return "facebook.tpl.html";
                }
            }
        };
    });



