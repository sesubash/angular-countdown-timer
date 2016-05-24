angular.module("app", ['sesu.countdown'])
.controller("mainController", function($scope){
	$scope.time = 0;
	$scope.finished = function(){
		console.log("finished");
	};
});