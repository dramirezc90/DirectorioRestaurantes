angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})


.controller('PlayListCtrl', function($scope, $http, $q) {

    var Restaurantes = [];

    $scope.init = function(){
        $scope.getRest()
        .then(function(res){
            //success
            console.log('Images: ', res);
            //$scope.restaurantes = res.results;
            $scope.restaurantes = res;
        }, function(status){
            //error
            console.log('Error', status);
            $scope.pageError = status;
        })
    }

    $scope.doRefresh = function(){
        $scope.getRest()
        .then(function(res){
            //success
            console.log('Images: ', res);
            //$scope.restaurantes = res.results;
            $scope.restaurantes = res;
        })
        .finally(function() {
            $scope.$broadcast('scroll.refreshComplete')
        })
    }
    
    $scope.getImages = function(){
        var defer = $q.defer();
        $http.jsonp('https://itunes.apple.com/lookup?callback=JSON_CALLBACK&id=909253&entity=album')
        //$http.get('http://localhost/servicioweb/servicioWebCitas.php')
        
        .success(function(res){
            defer.resolve(res)
        })
        .error(function(status, err){
            defer.reject(status)
        })
        return defer.promise;
    }

    
    $scope.getRest = function(){
        var defer = $q.defer();
        $http.get('http://localhost:8080/restaurantes')
        //$http.jsonp('http://localhost:8080/restaurantes?callback=JSON_CALLBACK')
        //$http.get('http://localhost/servicioweb/servicioWebCitas.php')

        .success(function(res){
            defer.resolve(res)
        })
        .error(function(status, err){
            defer.reject(status)
        })
        return defer.promise;
    }


    $scope.init();
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
