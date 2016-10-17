/**
 * Created by devit on 17/10/2016.
 */
swApp.controller('profileController', ['$scope','httpq','$http', function ($scope,httpq,$http) {

    //DEFININDO SE O USUÄRIO ESTÁ LOGADO
    $scope.userLoged = true;
    $scope.userID = '3a09593e-3e2e-4c17-a2de-2f308776dbd7';
    //MONTANDO A PESSOA COMPLETA
    $scope.person = [{
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
    }]

    //OS DADOS ABAIXO SÃO CARREGADOS AO ACESSAR A PÁGINA
    httpq.get('http://localhost:8080/swapitws/rs/person/getbyID/'+ $scope.userID)
        .then(function (data) {

            //ATUALIZA MODEL
            $scope.person = data;
        })
        .catch(function (response) {
            console.error('Xabu na consulta',response.status, response.data);
        })


    //OS DADOS ABAIXO SÃO CARREGADOS AO BUSCAR CEP
    $scope.getAddress = function () {
        httpq.get('http://localhost:8080/swapitws/rs/street/getbycep/'+$scope.person.addressReduce.zipcode)
            .then(function (data) {

                console.log(data);
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
