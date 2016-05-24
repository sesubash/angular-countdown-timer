angular.module("sesu.countdown", [])
.directive('countdownTimer', function($sce) {
    return {
        restrict: 'EA',
        replace: false,
        scope: {
            countdown: "=",
            interval: "=",
            active: "@",
            finishCallback: "&",
            endSoonCallback: "&" //will be called if counter going to end within 5 min
        },
        template:"<span ng-bind-html='formatted'></span>",
        link: function ($scope, $elem, $attrs) {
            if ($scope.countdown == 0) {
                return;
            }
            var milliseconds, timer;
            var endTimeStamp = moment().add($scope.countdown*$scope.interval);
            var queueTick = function () {
                timer =  window.setTimeout(function () {
                    var now  = moment();
                    var then = endTimeStamp;
                    //console.log(now, then);
                    milliseconds = moment(then, "DD/MM/YYYY HH:mm:ss").diff(moment(now,"DD/MM/YYYY HH:mm:ss"));
                    updateFormatted();
                    if (milliseconds <= 300000 && milliseconds >=299000) {
                        if (angular.isDefined($scope.endSoonCallback)) {
                            //$scope.endSoonCallback();
                            $scope.$eval($scope.endSoonCallback);
                        }
                    } else if(($scope.countdown != undefined) && milliseconds <= 0){
                        $scope.countdown = 0;
                        $scope.active = false;
                        if (angular.isDefined($scope.finishCallback)) {
                            //$scope.finishCallback();
                            $scope.$eval($scope.finishCallback);
                        }
                    }

                    if (milliseconds > 0) {
                        queueTick();
                    }

                    //console.log(milliseconds);
                    // if($scope.$$phase)
                    //     $scope.$digest();

                }, 1000/60);
            };

            if ($scope.active) {
                queueTick();
            }

            $scope.$watch('active', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    if (newValue === true) {
                        if ($scope.countdown > 0) {
                            queueTick();
                        } else {
                            $scope.active = false;
                        }
                    } else {
                        clearTimeout(timer);
                    }
                }
            });

            $scope.$watch('countdown', function () {
                //queueTick();
                endTimeStamp = moment().add($scope.countdown*$scope.interval);
            });

            $scope.$on('timer-start', function () {
              queueTick();
            });

            var updateFormatted = function () {
                if(milliseconds != undefined){
                    var duration = moment.duration(milliseconds);
                    duration.humanize();
                    var dayLbl = "days",
                        hourLbl = "hrs",
                        minLbl = "min",
                        secLbl = "sec";
                    if(duration.days() > 0)
                        $scope.formatted = $sce.trustAsHtml("<span class='ct-day'>"+duration.days()+"</span>"+"<span class='ct-day-lbl'>"+dayLbl+"</span>:<span class='ct-hr'>"+duration.hours()+"</span><span class='ct-hr-lbl'>"+hourLbl+"</span>:<span class='ct-min'>"+duration.minutes()+"</span><span class='ct-min-lbl'>"+minLbl+"</span>:<span class='ct-sec'>"+duration.seconds()+"</span><span class='ct-sec-lbl'>"+secLbl+"</span>");
                    else if(duration.days() <= 0 && duration.hours() > 0)
                       $scope.formatted = $sce.trustAsHtml("<span class='ct-hr'>"+duration.hours()+"</span><span class='ct-hr-lbl'>"+hourLbl+"</span>:<span class='ct-min'>"+duration.minutes()+"</span><span class='ct-min-lbl'>"+minLbl+"</span>:<span class='ct-sec'>"+duration.seconds()+"</span><span class='ct-sec-lbl'>"+secLbl+"</span>");
                    else if(!(duration.days() == 0 && duration.hours() == 0 && duration.minutes() == 0 && duration.seconds() == 0))
                        $scope.formatted = $sce.trustAsHtml("<span class='ct-min'>"+duration.minutes()+"</span><span class='ct-min-lbl'>"+minLbl+"</span>:<span class='ct-sec'>"+duration.seconds()+"</span><span class='ct-sec-lbl'>"+secLbl+"</span>");
                    $scope.$digest();
                    //console.log($scope.formatted, duration)
                    //console.log(milliseconds, [duration.days(), duration.hours(), duration.minutes(), duration.seconds()].join(':'));
                }
            };

            //updateFormatted();


            $scope.$on('$destroy', function () {
                window.clearTimeout(timer);
            });

        }
    };
})