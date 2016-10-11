/**
 * Created by devit on 03/10/2016.
 */
var swApp = angular.module('swApp', ['ngRoute']);


swApp.config(function ($routeProvider) {

    $routeProvider
        .when('/login', {
            templateUrl: 'pages/loginForm.html',
            controller: 'loginController'
        })

        .when('/register', {
            templateUrl: 'pages/registerForm.html',
            controller: 'registerController'
        })
        .when('/profile', {
            templateUrl: 'pages/profileManager.html',
            controller: 'profileController'
        })
        .when('/forgot', {
            templateUrl: 'pages/forgotForm.html',
            controller: 'forgotController'
        })

        .when('/start', {
            templateUrl: 'pages/start.html',
            controller: 'startController'
        })
        .when('/main',{
            templateUrl:'pages/main.html',
            controller:'mainController'
        })
        .when('/details',{
            templateUrl:'pages/propDetails.html',
            controller:'detailsController'
        })
        .when('/new',{
            templateUrl:'pages/newProposal.html',
            controller:'newProposalController'
        })
        .when('/edit',{
            templateUrl:'pages/newProposal.html',
            controller:'newProposalController'
        })
        .when('/', {
            templateUrl: 'pages/start.html',
            controller: 'startController'
        })
});

swApp.factory('httpq', function($http, $q) {
    return {
        get: function() {
            var deferred = $q.defer();
            $http.get.apply(null, arguments)
                .success(deferred.resolve)
                .error(deferred.resolve);
            return deferred.promise;
        }
    }
});


//Adicionar serviços no array e função.
swApp.controller('registerController', ['$scope', '$filter', '$http', '$location', function ($scope, $filter, $http, $location) {


    $scope.pswd1 = '';
    $scope.pswd2 = '';
    $scope.terms = '';


    $scope.person = {
        "personId": "",
        "personName": "",
        "email": "",
        "phone": "",
        "password": "",
        "sex": "",
        "blocked": "1",
        "level": "null"
    }


    $scope.newPerson = function () {
        $http.post('http://localhost:8080/swapitws/rs/person/save', $scope.person)


            .success(function (result) {

                console.log(result);
                console.log($scope.person);

                var $toastContent = $('<span>' +
                    '<i class="material-icons green-text">check</i>Conta criada!' +
                    '<p>Acesse seu e-mail para ativa-la!</p>' +
                    '</span>');
                Materialize.toast($toastContent, 10000);

                $location.path('/login');

            })
            .error(function (data, status) {

                console.log(data);
                var $toastContent = $('<span><i class="material-icons red-text">error_outline</i>  Algo deu errado!' +
                    '<p class="center">Tente novamente daqui a pouco...</p>' +
                    '</span>');
                Materialize.toast($toastContent, 10000);

            });
    }


    console.log($scope.person);

}]);

swApp.controller('loginController', ['$scope','$http', function ($scope,$http) {

    //BUSCA DADOS NA VIEW
   $scope.login={
       'email':"",
       'pass':""
   }

   //ENVIA DADOS PARA O WS
    $scope.login = function () {
        $http.get('http://localhost:8080/swapitws/rs/person/login/'+$scope.login.email+'/'+$scope.login.pass)


            .success(function (result) {

                console.log(result);
                console.log($scope.personId);

                //Aqui tenho que salvar a pessoa num singleton para poder acessar no fuuro

            })
            .error(function (data, status) {

                console.log(data);
                var $toastContent = $('<span><i class="material-icons red-text">error_outline</i>  Algo deu errado!' +
                    '<p class="center">Tente novamente daqui a pouco...</p>' +
                    '</span>');
                Materialize.toast($toastContent, 10000);

            });
    }

}]);

swApp.controller('forgotController', ['$scope', function ($scope) {

}]);

swApp.controller('startController', ['$scope', function ($scope,$rootScope, $location) {


    $scope.userLoged = false;


}]);
swApp.controller('mainController', ['$scope', function ($scope) {

    $scope.userLoged = false;

}]);

swApp.controller('detailsController', ['$scope', function ($scope) {

    $scope.userLoged = false;

}]);

swApp.controller('newProposalController', ['$scope', function ($scope) {

    $scope.userLoged = false;

}]);
swApp.controller('profileController', ['$scope','httpq', function ($scope,httpq) {

        //Definindo o usuário
        $scope.userLoged = true;

    httpq.get('http://localhost:8080/swapitws/rs/person/getbyID/3a09593e-3e2e-4c17-a2de-2f308776dbd7')
        .then(function (data) {
            $scope.person=data;

        })
        .catch(function (response) {
            console.error('Xabu na consulta',response.status, response.data);
        })
    
    console.log($scope.person);


    //MONTANDO A PESSOA
    $scope.personComplete = {
        "personId": "",
        "personName":"",
        "email": "",
        "phone": "",
        "password": "",
        "sex": "",
        "blocked": "",
        "level": "admin",
        "favorite": [

        ],
        "address": {
            "addressId": "cc8248f5-f000-4dfd-bb01-187790937404",
            "street": {
                "streetid": "00000055-9B33-4D28-901E-3B309F6C03F7",
                "streettype": {
                    "streettypeid": "EB3136E5-F68F-4A7A-BA14-B75BDA00AD54",
                    "name": "Rua"
                },
                "name": "Alcides Ribeiro da Silva",
                "complement": "NULL",
                "district": {
                    "districtid": "3C785FF3-33E1-43B8-A78D-4F3B20CF2AF6",
                    "name": "Gramame",
                    "city": {
                        "cityid": "81BD88D6-708D-4975-8502-23FD00771479",
                        "name": "JoÃ£o Pessoa",
                        "zipcode": "NULL",
                        "state": {
                            "stateid": "30A38B3B-CCAF-4017-AB51-B5713E28D405",
                            "acronym": "PB",
                            "name": "ParaÃ­ba",
                            "country": {
                                "countryId": "1CF60BF8-E241-4942-B9AF-27B76A2123A9",
                                "acronym": "BR",
                                "name": "Brasil"
                            }
                        }
                    }
                },
                "zipcode": "58067073"
            },
            "number": "555"
        }
    }


}]);