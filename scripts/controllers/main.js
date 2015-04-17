'use strict';

angular.module('sudokuApp')
  .controller('MainCtrl', function ($scope, $http) {
        var puzzleWidth = 9;
        var puzzleSize = puzzleWidth*puzzleWidth;
//        var difficulty = 0.6;
        var keyMap = {
            97:1,98:2,99:3,100:4,101:5,102:6,103:7,104:8,105:9,
            94:1,50:2,51:3,52:4,53:5,54:6,55:7,56:8,57:9
        };

        $scope.index = 0;
        $scope.currentPuzzle=[];
        var userAnswer = [];
        var rightAnswer = [2,9,5,7,4,3,8,6,1,4,3,1,8,6,5,9,2,7,8,7,6,1,9,2,5,4,3,3,8,7,4,5,9,2,1,6,6,1,2,3,8,7,4,9,5,5,4,9,2,1,6,7,3,8,7,6,3,5,3,4,1,8,9,9,2,8,6,7,1,3,5,4,1,5,4,9,3,8,6,7,2];

        // Method to
        var lockedOrNot = function(){
            var probability = [true, true, true, false, false];
            var i = Math.floor(Math.random() * probability.length);
            return probability[i];
        };

        var generatePuzzle = function(){
            rightAnswer.forEach(function(elem,index){
                var obj = {};
                var trueOrFalse = lockedOrNot();
                obj.number = trueOrFalse? elem : null ;
                obj.locked = trueOrFalse;
                $scope.currentPuzzle[index] = obj;

//                $scope.currentPuzzle[index].number = elem;
//                $scope.currentPuzzle[index].locked = lockedOrNot();
            });
        };

        generatePuzzle();

        $scope.checkAnswer = function(){
           $scope.currentPuzzle.forEach(function(element, index){
               userAnswer[index]=element.number;
           });
            return userAnswer == rightAnswer;
        };

        $scope.keyControl = function(e){
            var key = e.keyCode;
             switch (true){
                 case (key==37): //left
                     if($scope.index>0){
                         $scope.index--;
                     }
                     break;
                 case (key==39): //right
                     if($scope.index<puzzleSize-1){
                        $scope.index++;
                     }
                     break;
                 case (key==40): //down
                     if($scope.index<puzzleSize-puzzleWidth){
                         $scope.index+=puzzleWidth;
                     }
                     break;
                 case (key==38): //up
                     if($scope.index>puzzleWidth-1){
                         $scope.index-=puzzleWidth;
                     }
                     break;
                 case ((key>96 && key<106) ||(key>48 && key<58) ): //number inputs
                     if(!$scope.currentPuzzle[$scope.index].locked){
                         $scope.currentPuzzle[$scope.index].number = keyMap[key];
                     }
                     break;
             }
        }
  });
