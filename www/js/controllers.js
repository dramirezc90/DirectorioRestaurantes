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
    $scope.com = { corr : "", cal : "", comm : ""};


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
            });

        $scope.getComentarios()
            .then(function(res){
                //success
                $scope.comentarios = res;
                console.log($scope.comentarios);
            }, function(status) {
                //error
                console.log('Error', status);
                $scope.pageError = status;
            });

        $scope.getCategComida()
            .then(function (res) {
                //succes
                $scope.categComidas = res;
                console.log($scope.categComidas);
            }, function (status) {
                //error
                console.log('Error', status);
                $scope.pageError = status;
            })
    }

    $scope.submit = function() {

        console.log(this.com.corr);
        document.getElementById("correo").value = "";
        document.getElementById("calif").value = "";
        document.getElementById("coment").value = "";

        if(this.com.corr != "" && this.com.cal != "" && this.com.comm != "" ){
            $http({
                method: 'POST',
                url: 'http://localhost:8080/addCom',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    idR : $scope.id,
                    correo : this.com.corr,
                    calif : this.com.cal,
                    text : this.com.comm
                }
            }).success(function (res) {
                console.log(res);
            });
        } else {
            alert("Debe ingresar todos los campos.");
        }



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

    //SERVER CALL FOR COMMENTS ON RESTAURANT
    $scope.getComentarios = function(){
        var defer = $q.defer();
        $http.get('http://localhost:8080/comentarios/'+$scope.id)
            .success(function(res){
                defer.resolve(res)
            })
            .error(function(status, err){
                defer.reject(status)
            })
        return defer.promise;
    }

    //SERVER CALL FOR CATEGORIAS COMIDA ON RESTAURANT
    $scope.getCategComida = function(){
        var defer = $q.defer();
        $http.get('http://localhost:8080/comidas/'+$scope.id)
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


.controller('MapCtrl', function($scope, $ionicLoading, $compile, $q, $http) {

    $scope.init = function(){
        $scope.getLocations()
            .then(function(res){
                //success
                $scope.locations = res;
                console.log($scope.locations);
                $scope.centerOnMe();
            }, function(status){
                //error
                console.log('Error', status);
                $scope.pageError = status;
            })
    }

    //SERVER CALL FOR SPECIFIC RESTAURANT DATA
    $scope.getLocations = function(){

        var defer = $q.defer();
        $http.get('http://localhost:8080/mapa/')

            .success(function(res){
                defer.resolve(res)
            })
            .error(function(status, err){
                defer.reject(status)
            })
        return defer.promise;
    }


    function initialize() {
        var myLatLng = new google.maps.LatLng(4.116924, -73.650415);

        var mapOptions = {
            center: myLatLng,
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        //var contentString = "<div><a ng-click='clickTest()'>Click me</a></div>";
        //var compiled = $compile(contentString)($scope);
        //
        //var infoWindow = new google.maps.InfoWindow({
        //    content: compiled[0]
        //});


        // CARGAR LOS RESTAURANTES


        //var marker = new google.maps.Marker({
        //    position : myLatLng,
        //    map: map,
        //    title: 'Uluru (Ayers Rock)'
        //});

        //google.maps.event.addListener(marker, 'click', function() {
        //    infoWindow.open(map, marker);
        //});

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

        //var contentString = '<div id="content">'+
        //    '<div id="siteNotice">'+
        //    '</div>'+
        //    '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
        //    '<div id="bodyContent">'+
        //    '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
        //    'sandstone rock formation in the southern part of the '+
        //    'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
        //    'south west of the nearest large town, Alice Springs; 450&#160;km '+
        //    '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
        //    'features of the Uluru - Kata Tjuta National Park. Uluru is '+
        //    'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
        //    'Aboriginal people of the area. It has many springs, waterholes, '+
        //    'rock caves and ancient paintings. Uluru is listed as a World '+
        //    'Heritage Site.</p>'+
        //    '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
        //    'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
        //    '(last visited June 22, 2009).</p>'+
        //    '</div>'+
        //    '</div>';
        //
        //var contentString2 = '<div class="container">'+
        //        '<div class="row">'+
        //        '<div class="col-33"><img ng-src="'+$scope.locations[x].imagen+'"></div>'+
        //        '<div class="col-66"><p>'+$scope.locations[x].nombre+'</p>'+
        //        '</div>'+
        //        '</div>';
        //
        //var compiled = $compile(contentString)($scope);
        //
        //var infoWindow = new google.maps.InfoWindow({
        //    content: compiled[0]
        //});


        navigator.geolocation.getCurrentPosition(function(pos) {
            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            $ionicLoading.hide();
            var marker = new google.maps.Marker({
                position : new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                animation: google.maps.Animation.DROP,
                map : $scope.map,
                title : 'Ubicacion actual'
            })
            //$scope.loading.hide();
        }, function(error) {
            alert('No se pudo obtener ubicacion: '+error.message);
        });


        var infoWindow = new google.maps.InfoWindow();

        for(x = 0; x < $scope.locations.length ; x++){
            console.log($scope.locations[x]);
            var pos = new google.maps.LatLng($scope.locations[x].lat, $scope.locations[x].longi);

            var marker = new google.maps.Marker({
                position : pos,
                map : $scope.map,
                title : $scope.locations[x].nombre
            });

            var contentString2 = '<div class="map-content" width="300px">'+
                '<div class="row">'+
                '<div class="col-33"><a ng-href="#/app/restaurante/4"><img  width="300px" class="img-responsive" src="'+$scope.locations[x].imagen+'"></a></div>'+
                '</div><div class="row">'+
                '<div class="col-66"><h3><a href="#/app/restaurantes/'+ $scope.locations[x].idRestaurante+'">'+$scope.locations[x].nombre+'</a></h3></div>'+
                '</div>'+
                '</div>';


            //google.maps.event.addListener(marker, 'click', function() {
            //    infoWindow.setContent(contentString2);
            //    infoWindow.open($scope.map, marker);
            //});


            //google.maps.event.addListener(marker, 'click', function() {
            //    infoWindow.open($scope.map, marker);
            //});
            attachWindow(marker, contentString2);

        };



    };

    function attachWindow(marker, contentString2) {
        var infoWindow = new google.maps.InfoWindow({
            content: contentString2
        });

        google.maps.event.addListener(marker, 'click', function() {
            infoWindow.open($scope.map, marker);
        });
    }

    $scope.clickTest = function() {
        alert('Ejemplo de info window con ng-click')
    };

    $scope.init();
    //$scope.centerOnMe();

});
