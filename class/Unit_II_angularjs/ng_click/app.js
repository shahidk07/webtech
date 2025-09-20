var app=angular.module('app',[]);
app.controller('ctrl',function($scope){
   
   //greeting message
    $scope.sayhello='';
    $scope.clicked = function(){
        $scope.sayhello='assalamualaikum wa rahmatullahi wa barkatuhu'
    };

    //initialize counter value as 0
    $scope.value=0;
    // function to increment counter on click
    $scope.increment=function(){
      $scope.value=$scope.value+1;
    };
    // function to decrement counter on click
    $scope.decrement=function(){
        $scope.value=$scope.value-1;
    };
    // function to reset counter value to 0
    $scope.reset=function(){
        $scope.value=0;
    };

    //PASSING ARGUMENTS WITH FUNCTION

   

    //create a function with arguments name and age

    $scope.e4=function(name,age){
   $scope.user= {   name:name,age:age  };
    };


    //EXPERIMENT 5

$scope.edetails=function(event){
        $scope.clickX=event.clientX;
        $scope.clickY=event.clientY;
    };

    //EXPERIMENT 6
$scope.time= new Date();


// EXPERIMENT 7
$scope.e7count=0;
$scope.multi=function(){
    $scope.e7count+=1;
    $scope.time=new Date();
}
})


