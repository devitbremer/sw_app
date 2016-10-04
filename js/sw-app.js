/**
 * Created by devit on 03/10/2016.
 */
var swApp= angular.module('swApp',[]);

//Adicionar serviços no array e função.
swApp.controller('registerController',['$scope', '$filter', function($scope, $filter){

    //Criando modelo de pessoa.
    $scope.person={
        "name":"",
        "email":"",
        "phone":"",
        "pass":"",
    }


    $scope.pswd1='';
    $scope.pswd2='';

    console.log($scope.person);
} ]);