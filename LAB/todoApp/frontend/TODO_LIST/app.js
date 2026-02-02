var app = angular.module('myApp', []);
app.config(function($httpProvider) {
    // This tells the browser to attach the session cookie (connect.sid) 
    // to the AJAX request, even if the request URL is slightly different 
    // (e.g., different ports, which the browser treats as separate origins).
    $httpProvider.defaults.withCredentials = true;
});

// Ensure $http and $filter are injected
app.controller('ListController', function ($scope, $http, $filter) {
    // --- Data Setup ---
    $scope.allTasks = [];
    $scope.sortBy = '-createdAt'; // Default sort by newest (used by ng-orderBy)
    // Corrected API URL variable name to match usage
    const API_URL = '/api/todos/';

    // --- Data Watcher ---
    // Keeps activeTasks and completedTasks synchronized with allTasks
    $scope.$watch('allTasks', function (newTasks) {
        // NOTE: The $filter service must be injected into the controller function
        $scope.activeTasks = $filter('filter')(newTasks, { isChecked: false });
        $scope.completedTasks = $filter('filter')(newTasks, { isChecked: true });
    }, true);


$scope.saveTitle=function(){
    $http.put('api/todos/title',{
        title:$scope.listTitle||""
    }).
    catch(err=>console.log("Title save failed"))
};



    $scope.logout = function () {
        $http.post('/logout')
            .then(function (response) {
                window.location.href = '/';
            })
            .catch(function (error) {
                console.error("Logout error:", error);
            });
    };

     $scope.goBack=function(){
        window.location.href = '/';
     }
 
 

    // 1. LOAD: Fetch Tasks on Startup

    $scope.loadTasks = function () {
        $http.get(API_URL) // Server reads userId from session
            .then(function (response) {
                $scope.allTasks = response.data.tasks || [];
                $scope.listTitle=response.data.title||"";
                // Save username returned from the server
                $scope.user = {
                    username: response.data.username,
                    name:response.data.name
                };
            })
            .catch(function (error) {
                console.error("Error loading tasks:", error);
                // If status is 401 (Unauthorized), redirect to login
                if (error.status === 401) {
                    return window.location.href = '/login';
                }
            });
    };

    // 2. CREATE: Add New Task (POST)

    $scope.addItem = function () {
        const tempId = new Date().getTime().toString();
        // Use the correct field names from the schema
        const newItem = { _id: tempId, task: "", isChecked: false, createdAt: new Date() };

        $scope.allTasks.push(newItem);

        $http.post(API_URL, { task: newItem.task, isChecked: newItem.isChecked })
            .then(function (response) {
                $scope.loadTasks(); /* 
                Reload to get the official MongoDB _id this refetches entire list from the server after sending the newItem to server.
                and this is not a page reload ,it is data reload
                */
            })
            .catch(function (error) {
                console.error("Error adding task:", error);
                //if error occurs it uses filter() to remove the temporary task
                $scope.allTasks = $scope.allTasks.filter(item => item._id !== tempId);
            });
    };

    // 3. UPDATE/DELETE: Change Status/Text (PUT)

    $scope.updateTask = function (task) {
        // URL format: API_URL + 'task/' + task._id
        $http.put(API_URL + 'task/' + task._id, task)
        .then(function(response){
            $scope.loadTasks();
        })
            .catch(function (error) {
                console.error("Error updating task:", error);
                $scope.loadTasks(); // Revert changes on failure
            });
    };

    $scope.removeTask = function (taskId) {
        $http.delete(API_URL + 'task/' + taskId)
            .then(function (response) {
                $scope.allTasks = $scope.allTasks.filter(item => item._id !== taskId);
            })
            .catch(function (error) {
                console.error("Error deleting task:", error);
            });
    };
    

    // --- NEW: Angular Sorting Function ---
    // The HTML selects the value for $scope.sortBy. 
    // Angular's built-in orderBy filter handles the sorting in the view.
    // This function just ensures the correct value is set.
    $scope.sortList = function () {
        // The ng-model value is already set by the <select>.
        // No custom sorting logic is needed here if ng-repeat uses orderBy:sortBy

        // Example of how the value should be structured in HTML:
        // <option value="-createdAt">Time-Newest</option>
        // <option value="createdAt">Time-Oldest</option>
        console.log("Sorting list by:", $scope.sortBy);
    };

    // --- Placeholder for Clear All (Needs API route) ---
    $scope.clearAll = function () {
        if (confirm("Are you sure you want to clear ALL your tasks?")) {
            $http.delete(API_URL + 'all')
            .then(function (response) {
                $scope.allTasks = [];  // clear UI instantly
            })
            .catch(function (error) {
                console.error("Error clearing all tasks:", error);
            });
        }
    };

    // --- Initialization ---
    $scope.loadTasks();
});