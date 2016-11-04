/**
 * Created by devit on 03/10/2016.
 */
var swApp = angular.module('swApp', ['ngRoute','ngAnimate', 'ngTouch','ngFileUpload','angularTreeview','ngMask','angular-md5','ngCookies','socialLogin', '720kb.tooltips']);


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
        .when('/activate/:userId',{
            templateUrl:'pages/activate.html',
            controller:'personActivateController'
        })
        .when('/terms',{
            templateUrl:'pages/terms.html',
            controller:'termsController'
        })
        .when('/propEdit',{
            templateUrl:'pages/propEdit.html',
            controller:'propEditController'
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
    }
    return {
        link: fn_link
    }
} ]);

swApp.service('propService' ,['httpq',function (httpq) {

        this.propId ='';
        this.category = null;
        this.city = null;
        this.selectedState = '';
        this.price_max = 9999999;
        this.price_min = 0;
        this.title = null;

}]);

swApp.service('loginService', ['$location','httpq',function ($location,httpq) {

    this.rememberMe = '';
}]);

swApp.config(function(socialProvider){
    socialProvider.setGoogleKey("194841814966-te2iendhb3kjprk5d8gmooa5r4gma4j3.apps.googleusercontent.com");
    socialProvider.setFbKey({appId: "1785558785022990", apiVersion: "v2.8"});
});


swApp.controller('personActivateController', ['$scope','$routeParams','$http','httpq','$location', function ($scope,$routeParams,$http,httpq,$location) {

    $scope.user= {
        "personId": "",
        "personName": "",
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
    };

    httpq.get('http://localhost:8080/swapitws/rs/person/getbyID/'+ $routeParams.userId)
    
        .then(function (response) {
            console.log(response)
            if(response.blocked == 0){
                $location.path('/start')
            }
            else {
                $scope.user=response;
            }
        })
        .catch(function () {
            $location.path('/start')
        })

    $scope.unlock = function () {

        $scope.user.blocked =0
        $http.put('http://localhost:8080/swapitws/rs/person/update',$scope.user)
            .success(function () {
                $location.path('/start')
            })
            .error(function () {

            })
    }


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
    };


    $scope.newPerson = function () {

        $scope.person.password = md5.createHash($scope.pswd1 || '');

        $http.post('http://localhost:8080/swapitws/rs/person/save', $scope.person)
            .success(function (result) {
                var $toastContent = $('<span>' +
                    '<i class="material-icons green-text">check</i>Conta criada!' +
                    '<p>Acesse seu e-mail para ativa-la!</p>' +
                    '</span>');
                Materialize.toast($toastContent, 10000);

                console.log($scope.person);
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

swApp.controller('loginController', ['$scope','$http','md5','$location','$cookies','$rootScope','httpq', function ($scope,$http,md5,$location,$cookies,$rootScope,httpq) {

    //VERIFICA SE EXISTE LOGIN

    if($cookies.get('loginData')){
        $scope.user = JSON.parse($cookies.get('loginData'));
        $scope.userLoged = true;
        $location.path('/start');
    }
    else {
        //BUSCA DADOS NA VIEW
        $scope.loginData={
            'email':"",
            'pass':""
        };
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
        };

        //TRATAMENTO DO USUÁRIO VINDO DA REDE SOCIAL.
        $rootScope.$on('event:social-sign-in-success', function (event, userDetails) {

            $scope.person = {
                "personName": userDetails.name,
                "email": userDetails.email,
                "phone": "",
                "password": "",
                "sex": "",
                "blocked": "0",
                "level": "null"
            };
            $scope.person.password = md5.createHash($scope.person.password || '');

            //TENTA SALVAR A PESSOA
            $http.post('http://localhost:8080/swapitws/rs/person/save', $scope.person)

            //CASO SUCESSO USUÄRIO NÃO EXISTE SALVA A PESSOA
                .success(function () {

                    httpq.get('http://localhost:8080/swapitws/rs/person/getbyemail/' + $scope.person.email)
                        .then(function (result) {
                            //SALVA COOKIE
                            if ($scope.remember == true) {
                                var now = new Date(),
                                    exp = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate());

                                $cookies.put('loginData', JSON.stringify(result), {
                                    expires: exp
                                })
                            }
                            else {
                                var now = new Date(),
                                    exp = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
                                $cookies.put('loginData', JSON.stringify(result), {
                                    expires: exp
                                })
                            }
                            $location.path('/start');
                        })
                        .catch(function () {
                        })

                })

                //CASO ERRO USUÄRIO JÄ EXISTE
                .error(function (data, status) {
                    httpq.get('http://localhost:8080/swapitws/rs/person/getbyemail/' + $scope.person.email)
                        .then(function (result) {
                            //SALVA COOKIE
                            if ($scope.remember == true) {
                                var now = new Date(),
                                    exp = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate());
                                $cookies.put('loginData', JSON.stringify(result), {
                                    expires: exp
                                })
                            }
                            else {
                                var now = new Date(),
                                    exp = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
                                $cookies.put('loginData', JSON.stringify(result), {
                                    expires: exp
                                })
                            }
                            $location.path('/start');
                        })
                        .catch(function () {
                        })
                });
        })

    }

}]);

swApp.controller('forgotController', ['$scope', function ($scope) {

}]);

swApp.controller('startController', ['$scope','$location','$cookies','propService', function ($scope, $location,$cookies,propService) {

    /*$scope.user = JSON.parse($cookies.get('loginData'));
    if($scope.user.personId){
        $scope.userLoged = true;
    }
*/

    $scope.selectCategory = function (categoryId) {
        propService.category = categoryId;
        $location.path('/main');
    }



}]);
swApp.controller('mainController', ['$scope','httpq','$location','propService', function ($scope,httpq,$location,propService) {


    $scope.userLoged = false;
    $scope.userID = '3a09593e-3e2e-4c17-a2de-2f308776dbd7';
    $scope.propostas = [];


    $scope.getProps = function () {
        httpq.get('http://localhost:8080/swapitws/rs/proposition/getPropLike/'+propService.title+'/'+propService.category+'/'+propService.city+'/'+propService.price_max+'/'+propService.price_min)
            .then(function (response) {
                $scope.propostas = response;
            })
            .catch(function (response) {
                $scope.propostas = [];
                var $toastContent = $('<span><i class="material-icons red-text">search</i> Desculpe!' +
                    '<p class="center">Não conseguimos encontar nenhuma proposta...</p>' +
                    '</span>');
                Materialize.toast($toastContent, 5000);
            });
    }


    $scope.$watch(function () {return propService.city, propService.category;},function () {
        $scope.getProps();
        console.log('rodou a busca',propService.category)
    })

    



    //DIRECIONA PARA OS DETALHES DA PROPOSTA
    $scope.viewDetails = function (propositionId) {
        propService.propId = propositionId;
        $location.path('/details');
    }

}]);

swApp.controller('detailsController', ['$scope','propService','httpq','$location', function ($scope, propService,httpq,$location) {

    $scope.userLoged = false;
    $scope.propositionId = propService.propId;
    $scope.proposition = {};


    if (!propService.propId){

        $location.path('/main')
    }

    httpq.get('http://localhost:8080/swapitws/rs/proposition/getbyID/'+$scope.propositionId)

        .then(function (response) {
            $scope.proposition = response;


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

                     "interest_category":{
                         "categoryId":""
                     },

                     "personReduce":{
                     "personId":$scope.userID
                     },

                     "image":[],
                     "publish_date":"",
                     "removel_date":""
                    };


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
    };


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
    }
    $scope.flatdata='';
    //CARREGANDO CATEGORIAS
        httpq.get('http://localhost:8080/swapitws/rs/category/getAll')
            .then(function (data) {

                $scope.flatData = data;
                $scope.flatData3 = data;

                //Monta a arvore
                $scope.treedata = buildTree($scope.flatData, whereElementsIdIsInThisField, andTheReferenceToAParentIsInThisField, andSaveTheChildrenInThisField);
                console.log($scope.treedata);
                $scope.treedata2 = buildTree(angular.copy($scope.flatData), whereElementsIdIsInThisField, andTheReferenceToAParentIsInThisField, andSaveTheChildrenInThisField);
                $scope.treedata3 = buildTree(angular.copy($scope.flatData3), whereElementsIdIsInThisField, andTheReferenceToAParentIsInThisField, andSaveTheChildrenInThisField);
            })

            .catch(function (response) {
                console.error('Xabu na consulta', response.status, response.data);
            });


    //Watcher para setar as categorias da roposta
    $scope.$watch( 'categorias.currentNode', function( newObj, oldObj ) {
        if( $scope.categorias && angular.isObject($scope.categorias.currentNode) ) {
            $scope.newProp.category.categoryId = $scope.categorias.currentNode.categoryId;
        }
    }, false);

    $scope.$watch( 'vt_category.currentNode', function( newObj, oldObj ) {
        if( $scope.vt_category && angular.isObject($scope.vt_category.currentNode) ) {
            $scope.newProp.interest_category.categoryId = $scope.vt_category.currentNode.categoryId;
        }
    }, false);

    $scope.$watch( 't_category.currentNode', function( newObj, oldObj ) {
        if( $scope.t_category && angular.isObject($scope.t_category.currentNode) ) {
            $scope.newProp.interest_category.categoryId = $scope.t_category.currentNode.categoryId;
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
    };



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
    };

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
     }];

    //OS DADOS ABAIXO SÃO CARREGADOS AO ACESSAR A PÁGINA
    httpq.get('http://localhost:8080/swapitws/rs/person/getbyID/'+ $scope.userID)
        .then(function (data) {

            //ATUALIZA MODEL
            $scope.person = data;
        })
        .catch(function (response) {
            console.error('Xabu na consulta',response.status, response.data);
        });

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
    };

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

swApp.controller('proposalManagerController', ['$scope','httpq','$http','propService','$location', function ($scope,httpq,$http,propService,$location) {

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

            });



    $scope.deleteProp = function (propositionId) {

        console.log(propositionId)

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


                //ATUALIZA A PROPOSTA
                 $http.put('http://localhost:8080/swapitws/rs/proposition/update',$scope.singleProp)

                 .success(function (response) {
                     var $toastContent = $('<span>' +
                     '<i class="material-icons green-text">check</i>Feito! :)' +
                     '</span>');
                     Materialize.toast($toastContent, 5000);

                     //ATUALIZA O ESCOPO DE PROPOSTAS DO USUÄRIO
                     httpq.get('http://localhost:8080/swapitws/rs/proposition/getPropPerson/'+$scope.userID)

                         .then(function (response) {
                             $scope.userProps = response;
                         })
                         .catch(function (response) {

                         });
                 })

                 .error(function (response) {
                 console.log(response);
                 var $toastContent = $('<span>' +
                 '<i class="material-icons red-text">check</i>Não consegui remover a proposta!<p>Tente mais tarde :`(</p>' +
                 '</span>');
                 Materialize.toast($toastContent, 5000);
                 })

            })

            .catch(function () {
                var $toastContent = $('<span>' +
                    '<i class="material-icons red-text">check</i>O sistema está indisponível!<p>Tente mais tarde :`(</p>' +
                    '</span>');
                Materialize.toast($toastContent, 5000);
            })
    };

    $scope.editProp = function (propositionId) {

        propService.propId = propositionId

        $location.path('/propEdit');


    }

}])

swApp.controller('propEditController', ['$scope','httpq','$http','propService','$location', function ($scope,httpq,$http,propService,$location) {

    if(!propService.propId){
        $location.path('/propManager')
    }
    $scope.propositionId = propService.propId;
    $scope.proposition = {
                            "propositionId":"",
                            "title":"",
                            "description":"",
                            "addressReduce":{
                                "addressid":"",
                                "streetid":""
                            },
                            "price": 0,
                            "priceCatInterest":0,
                            "totalPrice":0,

                            "category":{
                                "categoryId":""
                            },

                            "interest_category":{
                                "categoryId":""
                            },

                            "personReduce":{
                                "personId":"",
                                "addressReduce":{
                                    "addressid":""
                                }
                            },

                            "image":[],
                            "publish_date":"",
                            "removel_date":null
                        };
    $scope.zipcode='';
    $scope.city = '';
    $scope.district='';

    //CHECKBOXES
    $scope.sell ='';
    $scope.swap ='';
    $scope.sw_sell='';


    httpq.get('http://localhost:8080/swapitws/rs/proposition/getbyID/'+$scope.propositionId)

        .then(function (response) {
            console.log(response)
            $scope.proposition.propositionId = response.propositionId;
            $scope.proposition.title = response.title;
            $scope.proposition.description = response.description;
            $scope.proposition.addressReduce.streetid = response.addressReduce.streetid;
            $scope.proposition.addressReduce.addressid = response.addressReduce.addressid;
            $scope.proposition.price = response.price;
            $scope.proposition.priceCatInterest = response.priceCatInterest;
            $scope.proposition.totalPrice = response.totalPrice;
            $scope.proposition.category.categoryId = response.category.categoryId;
            $scope.proposition.interest_category.categoryId = response.interest_category.categoryId;
            $scope.proposition.personReduce.personId =  response.personReduce.personId;
            $scope.proposition.personReduce.addressReduce.addressid =  response.personReduce.addressReduce.addressid;
            $scope.proposition.image =  response.image;
            $scope.proposition.publish_date = response.publish_date;
            $scope.zipcode = response.addressReduce.zipcode;
            $scope.city = response.addressReduce.cityName;
            $scope.district = response.addressReduce.districtName;

            //PREENCHE CHECKBOX
            if(($scope.proposition.price)&&($scope.proposition.priceCatInterest == 0)&&(!$scope.proposition.interest_category)){
                $scope.sell = true;
            }
            if(($scope.proposition.price==0)&&($scope.proposition.priceCatInterest == 0)&&($scope.proposition.interest_category)){
                $scope.swap = true;
            }
            if(($scope.proposition.price>0)&&($scope.proposition.priceCatInterest >0)&&($scope.proposition.interest_category)){
                $scope.sw_sell = true;
            }

        })
        .catch(function () {
            var $toastContent = $('<span>' +
                '<i class="material-icons red-text">check</i>Não consegui buscar a proposta!<p>Vamos tentar de novo! :`(</p>' +
                '</span>');
            Materialize.toast($toastContent, 5000);

            $location.path('/propManager')
        })

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

                $scope.proposition.image = response;

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
    };


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
    }
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
        });


    //Watcher para setar as categorias da roposta
    $scope.$watch( 'categorias.currentNode', function( newObj, oldObj ) {
        if( $scope.categorias && angular.isObject($scope.categorias.currentNode) ) {
            $scope.proposition.category.categoryId = $scope.categorias.currentNode.categoryId;
        }
    }, false);

    $scope.$watch( 'vt_category.currentNode', function( newObj, oldObj ) {
        if( $scope.vt_category && angular.isObject($scope.vt_category.currentNode) ) {
            $scope.proposition.interest_category.categoryId = $scope.vt_category.currentNode.categoryId;
        }
    }, false);

    $scope.$watch( 't_category.currentNode', function( newObj, oldObj ) {
        if( $scope.t_category && angular.isObject($scope.t_category.currentNode) ) {
            $scope.proposition.interest_category.categoryId = $scope.t_category.currentNode.categoryId;
        }
    }, false);



    //CAREGANDO O ENDEREÇO DA PROPOSTA
    $scope.getAddress = function () {
        httpq.get('http://localhost:8080/swapitws/rs/street/getbycep/'+$scope.proposition.addressReduce.zipcode)
            .then(function (data) {
                $scope.proposition.addressReduce.streetid = data.streetid;
                $scope.district = data.district.name;
                $scope.city = data.district.city.name;
            })
            .catch(function (response) {
                console.error('Xabu na consulta',response.status, response.data);
            })
    };

    $scope.saveProp = function(){

        if($scope.sell == true){
            $scope.proposition.interest_category = null;
            $scope.proposition.priceCatInterest = 0;
        }
        if($scope.swap == true){
            $scope.proposition.price = 0;
            $scope.proposition.priceCatInterest = 0;
        }

        var d = new Date($scope.proposition.publish_date);
        var datestring = d.getFullYear()+ "-"  + (d.getMonth()+1) + "-" +d.getDate();
        $scope.proposition.publish_date = datestring;


       $http.put('http://localhost:8080/swapitws/rs/proposition/update', $scope.proposition)
            .success(function (result) {
                console.log($scope.proposition)

                var $toastContent = $('<span>' +
                    '<i class="material-icons green-text">check</i>Proposta atualizada com sucesso !' +
                    '</span>');
                Materialize.toast($toastContent, 5000);

                $location.path('/propManager')

            })
            .error(function (data, status) {
                console.log($scope.proposition)
                console.log(data,status);
                console.log($scope.newProp);
                var $toastContent = $('<span><i class="material-icons red-text">error_outline</i>  Algo deu errado!' +
                    '<p class="center">Tente novamente daqui a pouco...</p>' +
                    '</span>');
                Materialize.toast($toastContent, 5000);

            });
    };

}])

swApp.controller('sideMenuController', ['$scope','$routeParams','$http','httpq','$location','propService', function ($scope,$routeParams,$http,httpq,$location,propService) {


    $scope.cities = '';
    $scope.states = '';
    $scope.categories = '';

    $scope.selectedState = '00D9B42B-28B3-4FA3-B149-DCB3147BB0B8';
    $scope.selectedCity = null;

    $scope.title=null;
    $scope.category=propService.categoryId;
    $scope.city=null;
    $scope.price_max=99999999;
    $scope.price_min=0;


    //BUSCA TODOS OS ESTADOS
    httpq.get('http://localhost:8080/swapitws/rs/state/get')

        .then(function (response) {
            $scope.states = response;
        })
        .catch(function (response) {

        });

    //BUSCA AS CIDADES DO ESTADO SELECIONADO
    $scope.$watch('selectedState', function () {
        httpq.get('http://localhost:8080/swapitws/rs/city/getCityState/'+$scope.selectedState)

            .then(function (response) {
                $scope.cities = response;
            })
            .catch(function (response) {
            })
    });

    $scope.$watch('selectedCity', function () {
        propService.city = $scope.selectedCity;
        propService.selectedState = $scope.selectedState;
    });


    $scope.$watch('category',function () {
        if($scope.category == null){

            httpq.get('http://localhost:8080/swapitws/rs/category/getParent/e1408c61-98bc-11e6-a3ce-80fa5b2affba')
                .then(function (response) {
                    $scope.categories = response;
                })
                .catch(function () {

                })
        }
        else {

            httpq.get('http://localhost:8080/swapitws/rs/category/getParent/'+$scope.category)
                .then(function (response) {
                    $scope.categories = response;
                })
                .catch(function () {

                })
        }
    })
    
    $scope.setCategory = function (categoryid) {
        $scope.category = categoryid;
        propService.category = categoryid;
    }
    $scope.resetCategories = function () {
        $scope.category = 'e1408c61-98bc-11e6-a3ce-80fa5b2affba';
        propService.category = null;
    }



}])

swApp.controller('indexController',['$scope','$location',function ($scope,$location) {


    $scope.$watch(function () {return $location.path();},function () {
        if (
            $location.path() === ('/') ||
            $location.path() === ('/start') ||
            $location.path() === ('/login') ||
            $location.path() === ('/register') ||
            $location.path() ===('/forgot') ||
            $location.path() === ('/activate') ||
            $location.path() === ('/terms')
        ){
            $scope.showSideBar = false;
            $scope.mainId = '';
        }
        else {
            $scope.showSideBar = true;
            $scope.mainId = 'main';
        }
    })

    $scope.$watch(function () {return $location.path();},function () {
        if (
            $location.path() === ('/login') ||
            $location.path() === ('/register') ||
            $location.path() ===('/forgot') ||
            $location.path() === ('/activate') ||
            $location.path() === ('/terms')
        ){
            $scope.showTopMenu = false;
        }
        else {
            $scope.showTopMenu = true;
        }
    })



}])


