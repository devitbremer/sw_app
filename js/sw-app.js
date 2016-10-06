/**
 * Created by devit on 03/10/2016.
 */
var swApp= angular.module('swApp',['ngRoute']);


swApp.config(function ($routeProvider) {

    $routeProvider
        .when('/',{
            templateUrl:'pages/loginForm.html',
            controller:'loginController'
        })

        .when('/register',{
            templateUrl:'pages/registerForm.html',
            controller:'registerController'
        })

        .when('/forgot',{
            templateUrl:'pages/forgotForm.html',
            controller:'forgotController'
        })
});


//Adicionar serviços no array e função.
swApp.controller('registerController',['$scope', '$filter', '$http','$location', function($scope, $filter,$http,$location){


    $scope.pswd1='';
    $scope.pswd2='';

    $scope.person ={
        "personId":"",
        "personName":"",
        "email":"",
        "phone":"",
        "password":"",
        "sex":"",
        "blocked":"",
        "level":""
    }


    $scope.newPerson = function () {
        $http.post('http://localhost:8080/swapitws/rs/person/save',$scope.person)


            .success(function (result) {

                console.log(result);
                console.log($scope.person);
                $location.path('/');

            })
            .error(function (data, status) {

                console.log(data);

            });
    }


    console.log($scope);

} ]);

swApp.controller('loginController',['$scope',function ($scope) {

}]);

swApp.controller('forgotController',['$scope',function ($scope) {

}]);