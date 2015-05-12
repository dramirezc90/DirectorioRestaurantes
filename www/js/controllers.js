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


.controller('RestaurantCtrl', function($scope, $http, $q) {

    var Restaurantes = [];

    $scope.init = function(){
        $scope.getRest()
        .then(function(res){
            //success
            console.log('Images: ', res);
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
            $scope.restaurantes = res;
        })
        .finally(function() {
            $scope.$broadcast('scroll.refreshComplete')
        })
    }


    // SERVER CALL FOR RESTAURANTS DATA
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

.controller('RestCtrl', function($scope, $stateParams, $http, $q) {

    $scope.id = $stateParams.restaurantId;

    $scope.init = function(){
        $scope.getRestaurant()
            .then(function(res){
                //success
                $scope.restaurante = res[0];
                console.log($scope.restaurante);
            }, function(status){
                //error
                console.log('Error', status);
                $scope.pageError = status;
            })
    }

    //SERVER CALL FOR SPECIFIC RESTAURANT DATA
    $scope.getRestaurant = function(){

        var defer = $q.defer();
        $http.get('http://localhost:8080/restaurantes/'+$scope.id)

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

.controller('MapCtrl', function($scope, $ionicLoading, $compile) {

    function initialize() {
        var myLatLng = new google.maps.LatLng(43.07493, -89.381388);

        var mapOptions = {
            center: myLatLng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        var contentString = "<div><a ng-click='clickTest()'>Click me</a></div>";
        var compiled = $compile(contentString)($scope);

        var infoWindow = new google.maps.InfoWindow({
            content: compiled[0]
        });

        var marker = new google.maps.Marker({
            position : myLatLng,
            map: map,
            title: 'Uluru (Ayers Rock)'
        });

        google.maps.event.addListener(marker, 'click', function() {
            infoWindow.open(map, marker);
        });

        $scope.map = map;
    }

    google.maps.event.addDomListener(window, 'load', initialize());

    $scope.centerOnMe = function() {
        if(!$scope.map) {
            return;
        }

        $scope.loading = $ionicLoading.show({
            content: 'Cargando Ubicacion actual... ',
            showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            $scope.loading.hide();
        }, function(error) {
            alert('No se pudo obtener ubicacion: '+error.message);
        });

    };

    $scope.clickTest = function() {
        alert('Ejemplo de info window con ng-click')
    };

});
