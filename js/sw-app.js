/**
 * Created by devit on 03/10/2016.
 */
var swApp = angular.module('swApp', ['ngRoute','ngAnimate', 'ngTouch','ngFileUpload','angularTreeview','ngMask','angular-md5','ngCookies']);


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
        .when('/propManager',{
            templateUrl:'pages/proposalManager.html',
            controller:'proposalManagerController'
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

swApp.directive('ngFiles', ['$parse', function ($parse) {

    function fn_link(scope, element, attrs) {
        var onChange = $parse(attrs.ngFiles);
        element.on('change', function (event) {
            onChange(scope, { $files: event.target.files });
        });
    };

    return {
        link: fn_link
    }
} ])

swApp.service('propositionDetails' ,function () {

    this.propId ='';
});

swApp.service('loginService', ['$location','httpq',function ($location,httpq) {

    this.rememberMe = '';
}])

swApp.controller('registerController', ['$scope', '$filter', '$http', '$location','md5', function ($scope, $filter, $http, $location,md5) {


    $scope.pswd1 = '';
    $scope.pswd2 = '';
    $scope.terms = '';


    $scope.person = {
        "personName": "",
        "email": "",
        "phone": "",
        "password": "",
        "sex": "",
        "blocked": "1",
        "level": "null"
    }


    $scope.newPerson = function () {

        $scope.person.password = md5.createHash($scope.pswd1 || '');

        $http.post('http://localhost:8080/swapitws/rs/person/save', $scope.person)
            .success(function (result) {
                var $toastContent = $('<span>' +
                    '<i class="material-icons green-text">check</i>Conta criada!' +
                    '<p>Acesse seu e-mail para ativa-la!</p>' +
                    '</span>');
                Materialize.toast($toastContent, 10000);

                console.log($scope.person)
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



}]);

swApp.controller('loginController', ['$scope','$http','md5','$location','$cookies', function ($scope,$http,md5,$location,$cookies) {

    //BUSCA DADOS NA VIEW
   $scope.loginData={
       'email':"",
       'pass':""
   }
    $scope.remember ='';


   //ENVIA DADOS PARA O WS
    $scope.login = function () {
        $scope.loginData.pass = md5.createHash($scope.loginData.pass || '');

        $http.get('http://localhost:8080/swapitws/rs/person/login/'+$scope.loginData.email+'/'+$scope.loginData.pass)

            .success(function (result) {

                if ($scope.remember == true) {
                    var now = new Date(),
                        exp = new Date(now.getFullYear(), now.getMonth()+2, now.getDate());

                    $cookies.put('loginData',JSON.stringify(result),{
                        expires: exp
                    })

                }
                $location.path('/start');



            })
            .error(function (data) {

                var $toastContent = $('<span><i class="material-icons red-text">error_outline</i> Usuário ou senha inválidos' +
                    '<p class="center"></p>' +
                    '</span>');
                Materialize.toast($toastContent, 10000);

            });
    }

}]);

swApp.controller('forgotController', ['$scope', function ($scope) {

}]);

swApp.controller('startController', ['$scope','$location','$cookies', function ($scope, $location,$cookies) {

    $scope.user = JSON.parse($cookies.get('loginData'));
    console.log($scope.user);
    $scope.userLoged = false;


}]);
swApp.controller('mainController', ['$scope','httpq','$location','propositionDetails','$cookies',function ($scope,httpq,$location,propositionDetails,$cookies) {


    $scope.userLoged = false;
    $scope.userID = '3a09593e-3e2e-4c17-a2de-2f308776dbd7';
    $scope.propostas = [];
    $scope.states=[];
    $scope.cities=[];
    $scope.selectedState='';
    $scope.selectCity = '';



    //BUSCA TODAS AS PROPOSTAS
    httpq.get('http://localhost:8080/swapitws/rs/proposition/getPropPerson/'+$scope.userID)

        .then(function (response) {
            $scope.propostas = response;

        })
        .catch(function (response) {
            console.log(response)
        })

    //BUSCA TODOS OS ESTADOS
    httpq.get('http://localhost:8080/swapitws/rs/state/get')

        .then(function (response) {
            $scope.states = response;
        })
        .catch(function (response) {

            console.log(response)
        })

    //BUSCA AS CIDADES DO ESTADO SELECIONADO
    $scope.$watch('selectedState', function () {
        httpq.get('http://localhost:8080/swapitws/rs/city/getCityState/'+$scope.selectedState)

            .then(function (response) {
                $scope.cities = response;
            })
            .catch(function (response) {
                console.log(response);
            })
    })

    //DIRECIONA PARA OS DETALHES DA PROPOSTA
    $scope.viewDetails = function (propositionId) {

        propositionDetails.propId = propositionId;
        $location.path('/details');
        console.log(propositionDetails.propId);
        
    }

}]);

swApp.controller('detailsController', ['$scope','propositionDetails','httpq','$location', function ($scope, propositionDetails,httpq,$location) {

    $scope.userLoged = false;
    $scope.propositionId = propositionDetails.propId;
    $scope.proposition = {};


    if (!propositionDetails.propId){

        $location.path('/main')
    }

    httpq.get('http://localhost:8080/swapitws/rs/proposition/getbyID/'+$scope.propositionId)

        .then(function (response) {
            $scope.proposition = response


            //GALERIA DE FOTOS
            $scope.photos = $scope.proposition.image;
            // Set of Photos

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

        })
        .catch(function (response) {
            console.log(response)
        })






}]);

swApp.controller('newProposalController', ['$scope','Upload','$timeout','httpq','$http', function ($scope, Upload, $timeout,httpq,$http) {

    $scope.userID = '3a09593e-3e2e-4c17-a2de-2f308776dbd7';
    $scope.userLoged = true;

    $scope.zipcode='';
    $scope.city = '';
    $scope.district='';

    //CHECKBOXES
    $scope.sell ='';
    $scope.swap ='';
    $scope.sw_sell='';

    //CAMPOS DE VALOR

    $scope.newProp={
                     "title":"",
                     "description":"",
                     "addressReduce":{
                     "streetid":""
                     },
                     "price": 0,
                     "priceCatInterest":0,
                     "totalPrice":0,

                     "category":{
                     "categoryId":""
                     },

                     "interest_category":"",

                     "personReduce":{
                     "personId":$scope.userID
                     },

                     "image":[],
                     "publish_date":"",
                     "removel_date":""
                    }


    //Função de Upload de imagens

    var formdata = new FormData();
    $scope.getTheFiles = function ($files) {
        angular.forEach($files, function (value, key) {
            formdata.append(key, value);
        });
    };

    // NOW UPLOAD THE FILES.
    $scope.uploadFiles = function () {

        var request = {
            method: 'POST',
            url: 'http://localhost:8080/swapitws/rs/propositionIMG/upload',
            data: formdata,
            headers: {
                'Content-Type': undefined
            }
        };

        // SEND THE FILES.
        $http(request)
            .success(function (response) {

                $scope.newProp.image = response;

                var $toastContent = $('<span>' +
                    '<i class="material-icons green-text">check</i>Ok! ;-)' +
                    '</span>');
                Materialize.toast($toastContent, 5000);

            })
            .error(function (response) {

                var $toastContent = $('<span>' +
                    '<i class="material-icons red-text">error</i>response' +'Algo deu errado :('+
                    '</span>');
                Materialize.toast($toastContent, 5000);

            });
    }


    //Criando Hierarquia de Categorias

    var whereElementsIdIsInThisField = 'categoryId';
    var andTheReferenceToAParentIsInThisField =  'parentId';
    var andSaveTheChildrenInThisField  = 'children';


//Função que monta a arvore
    function buildTree(flatList, idFieldName, parentKeyFieldName, fieldNameForChildren) {
        var rootElements = [];
        var lookup = {};

        // Take the flat list and transform it into a dictionary of key/values.
        // This will allow us to quickly get the reference of an object like a lookup table.
        flatList.forEach(function (flatItem) {
            var itemId = flatItem[idFieldName];
            lookup[itemId] = flatItem;
            flatItem[fieldNameForChildren] = [];
        });

        flatList.forEach(function (flatItem) {

            var parentKey = flatItem[parentKeyFieldName];

            if (parentKey != null) {

                // Item is linked to a parent, retrieve the parent.
                var parentObject = lookup[flatItem[parentKeyFieldName]];

                if(parentObject){
                    // Parent found, add the item as a child.
                    parentObject[fieldNameForChildren].push(flatItem);
                }else{
                    // No parent found, add the item as a root element.
                    rootElements.push(flatItem);
                }
            } else {
                // No parent, add the item as a root element.
                rootElements.push(flatItem);
            }

        });

        return rootElements;
    };


        //CARREGANDO CATEGORIAS
        httpq.get('http://localhost:8080/swapitws/rs/category/getAll')
            .then(function (data) {

                $scope.flatData = data;
                $scope.flatData3 = data;

                //Monta a arvore
                $scope.treedata = buildTree($scope.flatData, whereElementsIdIsInThisField, andTheReferenceToAParentIsInThisField, andSaveTheChildrenInThisField);
                $scope.treedata2 = buildTree(angular.copy($scope.flatData), whereElementsIdIsInThisField, andTheReferenceToAParentIsInThisField, andSaveTheChildrenInThisField);
                $scope.treedata3 = buildTree(angular.copy($scope.flatData3), whereElementsIdIsInThisField, andTheReferenceToAParentIsInThisField, andSaveTheChildrenInThisField);
            })

            .catch(function (response) {
                console.error('Xabu na consulta', response.status, response.data);
            })


    //Watcher para setar as categorias da roposta
    $scope.$watch( 'categorias.currentNode', function( newObj, oldObj ) {
        if( $scope.categorias && angular.isObject($scope.categorias.currentNode) ) {
            $scope.newProp.category.categoryId = $scope.categorias.currentNode.categoryId;
        }
    }, false);

    $scope.$watch( 'vt_category.currentNode', function( newObj, oldObj ) {
        if( $scope.vt_category && angular.isObject($scope.vt_category.currentNode) ) {
            $scope.newProp.interest_category = $scope.vt_category.currentNode.categoryId;
        }
    }, false);

    $scope.$watch( 't_category.currentNode', function( newObj, oldObj ) {
        if( $scope.t_category && angular.isObject($scope.t_category.currentNode) ) {
            $scope.newProp.interest_category = $scope.t_category.currentNode.categoryId;
        }
    }, false);



    //CAREGANDO O ENDEREÇO DA PROPOSTA
    $scope.getAddress = function () {
        httpq.get('http://localhost:8080/swapitws/rs/street/getbycep/'+$scope.zipcode)
            .then(function (data) {
                $scope.newProp.addressReduce.streetid = data.streetid;
                $scope.city = data.district.city.name;
                $scope.district = data.district.name;

            })
            .catch(function (response) {
                console.error('Xabu na consulta',response.status, response.data);
            })
    }



    $scope.saveProp = function(){

        //GERA DATA E ATUALIZA MODEL
        var d = new Date();
        var datestring = d.getFullYear()+ "-"  + (d.getMonth()+1) + "-" +d.getDate();
        $scope.newProp.publish_date = datestring;

        //ENVIA IMAGENS E ATUALIZA MODEL

        console.log('proposta ao enviar',$scope.newProp);
        $http.post('http://localhost:8080/swapitws/rs/proposition/save', $scope.newProp)

            .success(function (result) {

                var $toastContent = $('<span>' +
                    '<i class="material-icons green-text">check</i>Proposta Salva!' +
                    '</span>');
                Materialize.toast($toastContent, 5000);
                clearProp();

            })
            .error(function (data, status) {

                console.log(data,status);
                console.log($scope.newProp);
                var $toastContent = $('<span><i class="material-icons red-text">error_outline</i>  Algo deu errado!' +
                    '<p class="center">Tente novamente daqui a pouco...</p>' +
                    '</span>');
                Materialize.toast($toastContent, 5000);

            });
    }

    $scope.clearProp = function () {
        $scope.newProp ={
            "title":"",
            "description":"",
            "addressReduce":{
                "streetid":""
            },
            "price": 0,
            "priceCatInterest":0,
            "totalPrice":0,

            "category":{
                "categoryId":""
            },

            "interest_category":"",

            "personReduce":{
                "personId":""
            },

            "image":[],
            "publish_date":"",
            "removel_date":""
        }
    }


}]);


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

swApp.controller('proposalManagerController', ['$scope','httpq','$http', function ($scope,httpq,$http) {

    $scope.userLoged = true;
    $scope.userID = '3a09593e-3e2e-4c17-a2de-2f308776dbd7';
    $scope.userProps = [];
    $scope.singleProp = {};




    //BUSCA TODAS AS PROPOSTA DO USUÄRIO
        httpq.get('http://localhost:8080/swapitws/rs/proposition/getPropPerson/'+$scope.userID)

            .then(function (response) {
                $scope.userProps = response;
            })
            .catch(function (response) {

                console.log(response)
            })



    $scope.deleteProp = function (propositionId) {

        //BUSCA A PROPOSTA
        httpq.get('http://localhost:8080/swapitws/rs/proposition/getbyID/'+propositionId)

            .then(function (response) {
                $scope.singleProp = response;

                var d = new Date();
                var e = new Date($scope.singleProp.publish_date);

                var datestring = d.getFullYear()+ "-"  + (d.getMonth()+1) + "-" +d.getDate();
                var datestring2 = e.getFullYear()+ "-" + (e.getMonth()+1) + "-" +e.getDate();

                $scope.singleProp.publish_date = datestring2;
                $scope.singleProp.removel_date = datestring;
                console.log($scope.singleProp)
                //Atualiza a proposta
                $http.put('http://localhost:8080/swapitws/rs/proposition/update',$scope.singleProp)

                    .success(function (response) {
                        var $toastContent = $('<span>' +
                            '<i class="material-icons green-text">check</i>Feito! :)' +
                            '</span>');
                        Materialize.toast($toastContent, 5000);
                    })

                    .error(function (response) {
                        console.log(response)
                        var $toastContent = $('<span>' +
                            '<i class="material-icons red-text">check</i>Não consegui remover a proposta!<p>Tente mais tarde :`(</p>' +
                            '</span>');
                        Materialize.toast($toastContent, 5000);
                    })
            })
            .catch(function (response) {
                console.log(response);
            })

    }

    $scope.editProp = function (propositionId) {

        console.log(propositionId)

    }

}]);

