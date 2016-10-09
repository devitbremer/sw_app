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
swApp.controller('profileController', ['$scope','$http', function ($scope,$http) {

    //Definindo o usuário
    $scope.userLoged = true;
    $scope.personId='3a09593e-3e2e-4c17-a2de-2f308776dbd7';
    $scope.cep = '';

    //Aqui teremos que trocar para pegar a pessoa do singleton
    //BUSCANDO PESSOA
    $scope.getPerson = function () {
        $http.get('http://localhost:8080/swapitws/rs/person/getbyID/'+$scope.personId)


            .success(function (result) {

                console.log(result);
                console.log($scope.personId);

                //SALVANDO PESSOA NO $SCOPE
                $scope.person=result;
            })
            .error(function (data, status) {
                console.log(status);
                console.log(data);
                var $toastContent = $('<span><i class="material-icons red-text">error_outline</i>  Algo deu errado!' +
                    '<p class="center">Tente novamente daqui a pouco...</p>' +
                    '</span>');
                Materialize.toast($toastContent, 10000);

            });
    }

    //buscando CEP

    $scope.getAddress =  function () {

        $http.get('http://localhost:8080/swapitws/rs/street/getbycep/'+$scope.cep)

            .success(function (resultAddress) {

                console.log(resultAddress)

                //SALVANDO CEP NO $SCOPE
                $scope.address=resultAddress
            })

            .error(function (data,status) {

                console.log(data);
                console.log(status);

                var $toastContent = $('<span><i class="material-icons red-text">error_outline</i>  Algo deu errado!' +
                    '<p class="center">Erro ao buscar CEP...</p>' +
                    '</span>');
                Materialize.toast($toastContent, 10000);
            })

    }

}]);