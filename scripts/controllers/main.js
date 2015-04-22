//'use strict';


angular.module('sudokuApp')
    .controller('MainCtrl', function ($scope) {

        var puzzleWidth = 9;
//        var difficulty = 0.6;
        var keyMap = {
            97:1,98:2,99:3,100:4,101:5,102:6,103:7,104:8,105:9,
            49:1,50:2,51:3,52:4,53:5,54:6,55:7,56:8,57:9
        };

        $scope.index = [0,0];
        $scope.currentPuzzle=[];
        $scope.error = [];
        $scope.wantErrorIndication=true;
        var userAnswer = [];
        var rightAnswer = [
            [ 4,3,6,8,2,9,7,1,5 ],
            [ 5,1,7,3,4,6,9,8,2 ],
            [ 2,8,9,1,5,7,6,3,4 ],
            [ 3,6,4,5,9,2,8,7,1 ],
            [ 9,7,2,6,8,1,5,4,3 ],
            [ 1,5,8,4,7,3,2,9,6 ],
            [ 8,2,3,7,1,5,4,6,9 ],
            [ 7,9,1,2,6,4,3,5,8 ],
            [ 6,4,5,9,3,8,1,2,7 ]
        ];

        // Method to calculate if a number is locked with probability 0.6
        var isLocked = function(){
            var probability = [true, true, true, false, false];
            var i = Math.floor(Math.random() * probability.length);
            return probability[i];
        };

        //Generate puzzle by giving properties 'number' and 'locked' to every element of the 2d array rightAnswer
        //If a number is determined to be locked (using isLocked()), then the value is shown and get the locked class
        var generatePuzzle = function(){
            rightAnswer.forEach(function(column,index){
                var parentIndex = index;
                $scope.currentPuzzle[parentIndex]= [];
                column.forEach(function(elem,index){
                    var obj = {};
                    var locked = isLocked();
                    obj.number = locked? elem : null ;
                    obj.locked = locked;
                    $scope.currentPuzzle[parentIndex][index] = obj;
                });

            });
        };

        generatePuzzle();

        //Comparison of current user's answer with rightAnswer
        $scope.checkAnswer = function(){
            $scope.currentPuzzle.forEach(function(column, index){
                var parentIndex = index;
                userAnswer[parentIndex]=[];
                column.forEach(function(element, index){
                    userAnswer[parentIndex][index]=element.number;
                });
            });
            $scope.result = (JSON.stringify(userAnswer) == JSON.stringify(rightAnswer));
        };

        //Checks if the number shown on current selected number-box exists also in the corresponding row and column.
        $scope.validate = function(){
            $scope.error = [null];
            var currentColumn=[];
            var currentRow=[];
            var currentNumber = $scope.currentPuzzle[$scope.index[1]][$scope.index[0]].number;
            if(currentNumber){
                //make currentColumn
                $scope.currentPuzzle[$scope.index[1]].forEach(function(elem,index){
                    if(index == $scope.index[0]){
                        currentColumn[index] = null;
                    } else {
                        currentColumn[index] = elem.number;
                    }
                });

                //make currentRow
                for(var i=0;i<puzzleWidth;i++){
                    if(i == $scope.index[1]){
                        currentRow[i] = null;
                    } else {
                        currentRow[i] = $scope.currentPuzzle[i][$scope.index[0]].number;
                    }
                }

                //Construct $scope.error array that holds the coordinates to all error number-boxes
                var idxColumn = currentColumn.indexOf(currentNumber);
                var idxRow = currentRow.indexOf(currentNumber);
                if(idxColumn>=0){
                    $scope.error.push([idxColumn,$scope.index[1]]);
                }
                if(idxRow>=0) {
                    $scope.error.push([$scope.index[0],idxRow]);
                }
            }
        };

        //Check if the coordinates of a box-number is included in $scope.error array
        $scope.contains=function(coordinatesArray){
            var counter=0;
            $scope.error.forEach(function(element){
                if(JSON.stringify(element) == JSON.stringify(coordinatesArray)){
                    counter++;
                }
            });
            return counter;
        };

        $scope.keyControl = function(e){
            var key = e.keyCode;
            switch (true){
                case (key==37 || key==65): //left
                    if($scope.index[1]>0){
                        $scope.index[1]--;
                        if($scope.wantErrorIndication){
                            $scope.validate();
                        }
                    }
                    break;
                case (key==39 || key==68): //right
                    if($scope.index[1]<puzzleWidth-1){
                        $scope.index[1]++;
                        if($scope.wantErrorIndication){
                            $scope.validate();
                        }
                    }
                    break;
                case (key==40 || key==83): //down
                    if($scope.index[0]<puzzleWidth-1){
                        $scope.index[0]++;
                        if($scope.wantErrorIndication){
                            $scope.validate();
                        }
                    }
                    break;
                case (key==38 || key==87): //up
                    if($scope.index[0]>0){
                        $scope.index[0]--;
                        if($scope.wantErrorIndication){
                            $scope.validate();
                        }
                    }
                    break;
                case ((key>96 && key<106) ||(key>48 && key<58) ): //number inputs
                    if(!$scope.currentPuzzle[$scope.index[1]][$scope.index[0]].locked){
                        $scope.currentPuzzle[$scope.index[1]][$scope.index[0]].number = keyMap[key];
                    }
                    $scope.checkAnswer();
                    if($scope.wantErrorIndication){
                        $scope.validate();
                    }
                    break;
            }
        };

    });


