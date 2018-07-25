angular.module('projectViewerApp', [])
    .controller('projectViewerController', ['$scope', function($scope) {
        $scope.images = [
            {img_name:"/images/uploads/1532463203998-ScreenHunter38.png"},
            {img_name:"/images/uploads/1532463203998-ScreenHunter38.png"},
            {img_name:"/images/uploads/1532463203998-ScreenHunter38.png"},
            {img_name:"/images/uploads/1532463203998-ScreenHunter38.png"},
            {img_name:"/images/uploads/1532463203998-ScreenHunter38.png"},
            {img_name:"/images/uploads/1532463203998-ScreenHunter38.png"}
            ];
        // $scope.images = $scope.project.images;
    }]);
