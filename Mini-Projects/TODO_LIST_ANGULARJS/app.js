angular.module('todoApp',[])
.controller('TodoController',function($scope){
    const STORAGE_KEY ='angular-todos';
    $scope.loadTodos =function(){
        const stored =localStorage.getItem(STORAGE_KEY);
        $scope.todos =stored?JSON.parse(stored):[]
    }
})
