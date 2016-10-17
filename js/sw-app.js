/**
 * Created by devit on 03/10/2016.
 */
var swApp = angular.module('swApp', ['ngRoute','ngAnimate', 'ngTouch','ngFileUpload']);


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

    //GALERIA DE FOTOS
    // Set of Photos
    $scope.photos = [
        {src: 'http://farm9.staticflickr.com/8042/7918423710_e6dd168d7c_b.jpg', desc: 'Image 01'},
        {src: 'http://farm9.staticflickr.com/8449/7918424278_4835c85e7a_b.jpg', desc: 'Image 02'},
        {src: 'http://farm9.staticflickr.com/8457/7918424412_bb641455c7_b.jpg', desc: 'Image 03'},
        {src: 'http://farm9.staticflickr.com/8179/7918424842_c79f7e345c_b.jpg', desc: 'Image 04'},
        {src: 'http://farm9.staticflickr.com/8315/7918425138_b739f0df53_b.jpg', desc: 'Image 05'},
        {src: 'http://farm9.staticflickr.com/8461/7918425364_fe6753aa75_b.jpg', desc: 'Image 06'}
    ];

    // initial image index
    $scope._Index = 0;

    // if a current image is the same as requested image
    $scope.isActive = function (index) {
        return $scope._Index === index;
    };

    // show prev image
    $scope.showPrev = function () {
        $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.photos.length - 1;
    };

    // show next image
    $scope.showNext = function () {
        $scope._Index = ($scope._Index < $scope.photos.length - 1) ? ++$scope._Index : 0;
    };

    // show a certain image
    $scope.showPhoto = function (index) {
        $scope._Index = index;
    };



}]);

swApp.controller('newProposalController', ['$scope','Upload','$timeout', function ($scope, Upload, $timeout) {

    $scope.userLoged = false;

    $scope.uploadFiles = function(files, errFiles) {
        $scope.files = files;
        $scope.errFiles = errFiles;
        angular.forEach(files, function(file) {
            file.upload = Upload.upload({
                url: 'http://localhost/sw_app/images/proposal_images/',
                data: {file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                    evt.loaded / evt.total));
            });
        });
    }

}]);
swApp.controller('profileController', ['$scope','httpq', function ($scope,httpq) {

    //DEFININDO SE O USUÄRIO ESTÁ LOGADO
    $scope.userLoged = true;
    $scope.userID = '3a09593e-3e2e-4c17-a2de-2f308776dbd7';
    //MONTANDO A PESSOA COMPLETA
    $scope.person = {
        "personId": "",
        "personName":"",
        "email": "",
        "phone": "",
        "password": "",
        "sex": "",
        "blocked": "",
        "level": "",
        "favorite": [],
        "addressReduce": {
            "streetid": "",
            "zipcode": "",
            "streetName": "",
            "complement": "",
            "number": "",
            "districtName": "",
            "cityName": "",
            "stateAcronym": "",
            "stateName": "",
            "countryAcronym": "",
            "countryName": ""
        }
     }

    //OS DADOS ABAIXO SÃO CARREGADOS AO ACESSAR A PÁGINA
    httpq.get('http://10.11.0.96:8080/swapitws/rs/person/getbyID/'+ $scope.userID)
        .then(function (data) {

            //ATUALIZA MODEL
            $scope.person = data;
        })
        .catch(function (response) {
            console.error('Xabu na consulta',response.status, response.data);
        })


    //OS DADOS ABAIXO SÃO CARREGADOS AO BUSCAR CEP
    $scope.getAddress = function () {
        httpq.get('http://10.11.0.96:8080/swapitws/rs/street/getbycep/'+$scope.person.addressReduce.zipcode)
            .then(function (data) {
                //ATUALIZA MODEL COM
                $scope.person.addressReduce.streetid = data.streetid;
                $scope.person.addressReduce.streetName = data.name;
                $scope.person.addressReduce.complement = data.complement;
                $scope.person.addressReduce.number = '';
                $scope.person.addressReduce.districtName = data.district.name;
                $scope.person.addressReduce.cityName = data.district.city.name;
                $scope.person.addressReduce.stateAcronym= data.district.city.state.acronym;
                $scope.person.addressReduce.stateName = data.district.city.state.name;
                $scope.person.addressReduce.countryAcronym= data.district.city.state.country.acronym;
                $scope.person.addressReduce.countryName = data.district.city.state.country.name;

            })
            .catch(function (response) {
                console.error('Xabu na consulta',response.status, response.data);
            })
    }

    $scope.updatePerson = function(){
        $http.put('http://localhost:8080/swapitws/rs/person/update', $scope.person)

            .success(function (result) {

                console.log(result);
                console.log($scope.person);

                var $toastContent = $('<span>' +
                    '<i class="material-icons green-text">check</i>Cadastro Atualizado!' +
                    '</span>');
                Materialize.toast($toastContent, 5000);

            })
            .error(function (data, status) {

                console.log(data);
                var $toastContent = $('<span><i class="material-icons red-text">error_outline</i>  Algo deu errado!' +
                    '<p class="center">Tente novamente daqui a pouco...</p>' +
                    '</span>');
                Materialize.toast($toastContent, 5000);

            });
    }
    

}]);