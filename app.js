angular.module("app", ['sesu.countdown'])
.controller("mainController", function($scope){
	$scope.time = 100;
});