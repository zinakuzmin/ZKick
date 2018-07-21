angular.module("app", [])


    .controller("Controller", function($scope, $http){
        $http.get("projects")
            .then(function(response) {
                $scope.projects = response.data;
            })
        // .controller("Controller", function($scope){
        // $scope.users = [
        //     {name: "John", type: "twitter", description: "balbla"},
        //     {name: "Maria" ,type: "facebook"}
        // ];
    })

    // .controller("Controller", function($scope, $http){
    //     for (project in $scope.projects){
    //         $http.get("getprojectimage", $scope.projects[project].ID)
    //             .then(function(response) {
    //                 $scope.projects[project]['images'] = response.data;
    //             })
    //     }

        // .controller("Controller", function($scope){
        // $scope.users = [
        //     {name: "John", type: "twitter", description: "balbla"},
        //     {name: "Maria" ,type: "facebook"}
        // ];
    // })

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
                // getTemplateUrl = function() {
                    //basic handling. It could be delegated to different Services
                    // if ($scope.user.type == "twitter")
                    if ($scope.project.status == "opened")
                        return "twitter.tpl.html";
                    // if ($scope.user.type == "project2")
                    //     return "facebook.tpl.html";
                }
            }
        };
    });



