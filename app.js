angular.module("app", ['sesu.countdown'])
.controller("mainController", function($scope){
	$scope.time = 1000;
	$scope.finished = function(){
		console.log("finished");
	};
});