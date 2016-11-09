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
        .when('/favorites',{
            templateUrl:'pages/favorites.html',
            controller:'favoritesController'
        })
        .when('/adm',{
            templateUrl:'pages/admProposals.html',
            controller:'admController'
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

swApp.service('propService' ,[function () {

    //Essas variáveis são pra pesquisa
        this.propId ='';
        this.category = null;
        this.city = null;
        this.selectedState = '';
        this.price_max = 9999999;
        this.price_min = 0;
        this.title = null;

    //Essas variáveis são para nova proposta
    this.newPropCat = null;
    this.newPropCatInterest = null;

}]);

swApp.service('loginService', ['$cookies',function ($cookies) {

    if($cookies.get('loginData')) {
        this.user =  JSON.parse($cookies.get('loginData'));
        this.userLoged = true;
    }
    else {
        this.userLoged = false;
    }

    this.path = '/start';

    this.refreshUser = function () {
        this.user =  JSON.parse($cookies.get('loginData'));
    }
}]);


swApp.config(function(socialProvider){
    socialProvider.setGoogleKey("267578709067-o0l2h5p2i59of2247t6gk33uhr1fn6gk.apps.googleusercontent.com");
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

    httpq.get('http://10.11.0.96:8080/swapitws/rs/person/getbyID/'+ $routeParams.userId)
    
        .then(function (response) {
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
        $http.put('http://10.11.0.96:8080/swapitws/rs/person/update',$scope.user)
            .success(function () {
                $location.path('/start')
            })
            .error(function () {

            })
    }


}])


swApp.controller('registerController', ['$scope', '$filter', '$http', '$location','md5','$rootScope','loginService','httpq','$cookies', function ($scope, $filter, $http, $location,md5,$rootScope,loginService,httpq,$cookies) {


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

        $http.post('http://10.11.0.96:8080/swapitws/rs/person/save', $scope.person)
            .success(function (result) {
                var $toastContent = $('<span>' +
                    '<i class="material-icons green-text">check</i>Conta criada!' +
                    '<p>Acesse seu e-mail para ativa-la!</p>' +
                    '</span>');
                Materialize.toast($toastContent, 10000);

                $location.path('/login');

            })
            .error(function (data, status) {
                var $toastContent = $('<span><i class="material-icons red-text">error_outline</i>  Algo deu errado!' +
                    '<p class="center">Tente novamente daqui a pouco...</p>' +
                    '</span>');
                Materialize.toast($toastContent, 10000);

            });
    }

    //LOGIN FACEBOOK.
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
        $scope.person.password = md5.createHash($scope.person.password || userDetails.email);

        //TENTA SALVAR A PESSOA
        $http.post('http://10.11.0.96:8080/swapitws/rs/person/save', $scope.person)

        //CASO SUCESSO USUÄRIO NÃO EXISTE SALVA A PESSOA
            .success(function () {

                httpq.get('http://10.11.0.96:8080/swapitws/rs/person/getbyemail/' + $scope.person.email)
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
                        loginService.userLoged = true;
                        loginService.refreshUser();
                        $location.path(loginService.path);
                    })
                    .catch(function () {
                    })

            })

            //CASO ERRO USUÄRIO JÄ EXISTE
            .error(function (data, status) {
                httpq.get('http://10.11.0.96:8080/swapitws/rs/person/getbyemail/' + $scope.person.email)
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
                        loginService.userLoged = true;
                        loginService.refreshUser();
                        $location.path(loginService.path);
                    })
                    .catch(function () {
                    })
            });
    });



}]);

swApp.controller('loginController', ['$scope','$http','md5','$location','$cookies','$rootScope','httpq','loginService', function ($scope,$http,md5,$location,$cookies,$rootScope,httpq,loginService) {

    //VERIFICA SE EXISTE LOGIN

    if(loginService.userLoged == true){
        $location.path(loginService.path);
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
            $http.get('http://10.11.0.96:8080/swapitws/rs/person/login/'+$scope.loginData.email+'/'+$scope.loginData.pass)
                .success(function (result) {
                    if ($scope.remember == true) {
                        var now = new Date(),
                            exp = new Date(now.getFullYear(), now.getMonth()+2, now.getDate());

                        $cookies.put('loginData',JSON.stringify(result),{
                            expires: exp
                        })
                    }
                    loginService.userLoged = true;
                    loginService.refreshUser();
                    $location.path(loginService.path);
                })
                .error(function (data) {

                    var $toastContent = $('<span><i class="material-icons red-text">error_outline</i> Usuário ou senha inválidos' +
                        '<p class="center"></p>' +
                        '</span>');
                    Materialize.toast($toastContent, 10000);

                });
        };

        //LOGIN REDES SOCIAIS.
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
            $scope.person.password = md5.createHash($scope.person.password || userDetails.email);

            //TENTA SALVAR A PESSOA
            $http.post('http://10.11.0.96:8080/swapitws/rs/person/save', $scope.person)

            //CASO SUCESSO USUÄRIO NÃO EXISTE SALVA A PESSOA
                .success(function () {

                    httpq.get('http://10.11.0.96:8080/swapitws/rs/person/getbyemail/' + $scope.person.email)
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
                            loginService.userLoged = true;
                            loginService.refreshUser();
                            $location.path(loginService.path);
                        })
                        .catch(function () {
                        })

                })

                //CASO ERRO USUÄRIO JÄ EXISTE
                .error(function (data, status) {
                    httpq.get('http://10.11.0.96:8080/swapitws/rs/person/getbyemail/' + $scope.person.email)
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
                            loginService.userLoged = true;
                            loginService.refreshUser();
                            $location.path(loginService.path);
                        })
                        .catch(function () {
                        })
                });
        });

/*Abaixo termina o else*/
    }

}]);

swApp.controller('forgotController', ['$scope', function ($scope) {

}]);

swApp.controller('startController', ['$scope','$location','$cookies','propService','loginService', function ($scope, $location,$cookies,propService,loginService) {

    $scope.selectCategory = function (categoryId) {
        propService.category = categoryId;
        $location.path('/main');
    }



}]);
swApp.controller('mainController', ['$scope','httpq','$location','propService', function ($scope,httpq,$location,propService) {

    $scope.propostas = [];


    $scope.getProps = function () {
        httpq.get('http://10.11.0.96:8080/swapitws/rs/proposition/getPropLike/'+propService.title+'/'+propService.category+'/'+propService.city+'/'+propService.price_max+'/'+propService.price_min)
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

    $scope.$watch(function () {return propService.title;},function () {
        $scope.getProps();
    })

    $scope.$watch(function () {return propService.city;},function () {
        $scope.getProps();
    })

    $scope.$watch(function () {return propService.category;},function () {
        $scope.getProps();
    })

    $scope.$watch(function () {return propService.price_max;},function () {
        $scope.getProps();
    })

    $scope.$watch(function () {return propService.price_min;},function () {
        $scope.getProps();
    })


    //DIRECIONA PARA OS DETALHES DA PROPOSTA
    $scope.viewDetails = function (propositionId) {
        propService.propId = propositionId;
        $location.path('/details');
    }

}]);

swApp.controller('detailsController', ['$scope','propService','httpq','$location','$http','loginService', function ($scope, propService,httpq,$location,$http,loginService) {

    $scope.propositionId = propService.propId;
    $scope.proposition = {};
    $scope.userId = '';
    $scope.userLoged = '';


    if (!propService.propId){

        $location.path('/main')
    }

    if(loginService.userLoged == true){
        $scope.userId = loginService.user.personId
        $scope.userLoged = loginService.userLoged;

    }
   //BUSCA PROPOSTA
    httpq.get('http://10.11.0.96:8080/swapitws/rs/proposition/getbyID/'+$scope.propositionId)

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
        })


    $scope.addDenunce = function () {
        $http.post('http://10.11.0.96:8080/swapitws/rs/proposition/denunce/'+$scope.propositionId)
            .success(function (response) {
                var $toastContent = $('<span>' +
                    '<i class="material-icons red-text left">block</i>Ok! Vamos verrificar isso...' +
                    '</span>');
                Materialize.toast($toastContent, 5000);
            })
            .error(function (response) {
            })
    }


    $scope.addFavorite = function () {

        $scope.person = [{
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
        }];

        httpq.get('http://10.11.0.96:8080/swapitws/rs/person/getbyID/' + $scope.userId)
            .then(function (data) {
                //ATUALIZA MODEL
                $scope.person = data;
                $scope.person.favorite.push(
                    {
                        "personid": $scope.person.personId,
                        "propositionid": $scope.propositionId
                    })

                $http.put('http://10.11.0.96:8080/swapitws/rs/person/update', $scope.person)
                    .success(function (result) {
                        var $toastContent = $('<span>' +
                            '<i class="material-icons red-text left">favorite</i>Salvamos o favorito pra você' +
                            '</span>');
                        Materialize.toast($toastContent, 5000);
                    })
                    .error(function (data, status) {
                    });
            })
            .catch(function (response) {
            });

        
    }





}]);

swApp.controller('newProposalController', ['$scope','Upload','$timeout','httpq','$http','loginService','$location','propService',function ($scope, Upload, $timeout,httpq,$http,loginService,$location,propService) {

    if(loginService.userLoged == true) {
        $scope.userID = loginService.user.personId;
        $scope.zipcode = '';
        $scope.city = '';
        $scope.district = '';

        //CHECKBOXES
        $scope.sell = '';
        $scope.swap = '';
        $scope.sw_sell = '';

        //CAMPOS DE VALOR

        $scope.newProp = {
            "title": "",
            "description": "",
            "addressReduce": {
                "streetid": ""
            },
            "price": 0,
            "priceCatInterest": 0,
            "totalPrice": 0,

            "category": {
                "categoryId": ""
            },

            "interest_category": {
                "categoryId": ""
            },

            "personReduce": {
                "personId": $scope.userID
            },

            "image": [],
            "publish_date": "",
            "removel_date": ""
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
                url: 'http://10.11.0.96:8080/swapitws/rs/propositionIMG/upload',
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
                        '<i class="material-icons red-text">error</i>response' + 'Algo deu errado :(' +
                        '</span>');
                    Materialize.toast($toastContent, 5000);

                });
        };

        //CATEGORIAS DA PROPOSTA
        $scope.$watch(function () {return propService.newPropCat},function () {
            if($scope.category == null){

                httpq.get('http://10.11.0.96:8080/swapitws/rs/category/getParent/e1408c61-98bc-11e6-a3ce-80fa5b2affba')
                    .then(function (response) {
                        $scope.categories = response;
                    })
                    .catch(function () {

                    })
            }
            else {

                httpq.get('http://10.11.0.96:8080/swapitws/rs/category/getParent/'+$scope.category)
                    .then(function (response) {
                        $scope.categories = response;
                    })
                    .catch(function () {

                    })
            }
        });

        $scope.setCategory = function (categoryid, categoryName) {
            $scope.category = categoryid;
            propService.newPropCat = categoryid;
            $scope.newProp.category.categoryId = categoryid;
            $scope.categoryName = categoryName
        }
        $scope.resetCategories = function () {
            $scope.category = 'e1408c61-98bc-11e6-a3ce-80fa5b2affba';
            propService.newPropCat = null;
            $scope.categoryName = '';
            $scope.newProp.category.categoryId = '';
        }



        //CATEGORIAS DE INTERESSE
        $scope.$watch(function () {return propService.newPropCatInterest},function () {
            if($scope.categoryInterest == null){

                httpq.get('http://10.11.0.96:8080/swapitws/rs/category/getParent/e1408c61-98bc-11e6-a3ce-80fa5b2affba')
                    .then(function (response) {
                        $scope.interestCategories = response;
                    })
                    .catch(function () {

                    })
            }
            else {

                httpq.get('http://10.11.0.96:8080/swapitws/rs/category/getParent/'+$scope.categoryInterest)
                    .then(function (response) {
                        $scope.interestCategories = response;
                    })
                    .catch(function () {

                    })
            }
        });

        $scope.setInterestCategory = function (categoryid, categoryName) {
            $scope.categoryInterest = categoryid;
            propService.newPropCatInterest = categoryid;
            $scope.newProp.interest_category.categoryId = categoryid;
            $scope.interestCategoryName = categoryName
        }
        $scope.resetInterestCategories = function () {
            $scope.categoryInterest = 'e1408c61-98bc-11e6-a3ce-80fa5b2affba';
            propService.newPropCatInterest = null;
            $scope.interestCategoryName = '';
            $scope.newProp.interest_category.categoryId = '';
        }


        //CAREGANDO O ENDEREÇO DA PROPOSTA
        $scope.getAddress = function () {
            httpq.get('http://10.11.0.96:8080/swapitws/rs/street/getbycep/' + $scope.zipcode)
                .then(function (data) {
                    $scope.newProp.addressReduce.streetid = data.streetid;
                    $scope.city = data.district.city.name;
                    $scope.district = data.district.name;

                })
                .catch(function (response) {
                })
        };


        $scope.saveProp = function () {

            //GERA DATA E ATUALIZA MODEL
            var d = new Date();
            var datestring = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
            $scope.newProp.publish_date = datestring;

            if($scope.newProp.interest_category.categoryId == ''){
                $scope.newProp.interest_category.categoryId = null;
            }

            //ENVIA IMAGENS E ATUALIZA MODEL

            $http.post('http://10.11.0.96:8080/swapitws/rs/proposition/save', $scope.newProp)

                .success(function (result) {
                    var $toastContent = $('<span>' +
                        '<i class="material-icons green-text">check</i>Proposta Salva!' +
                        '</span>');
                    Materialize.toast($toastContent, 5000);

                    $scope.clearProp()

                    %location.path('/main')

                })
                .error(function (data, status) {
                    var $toastContent = $('<span><i class="material-icons red-text">error_outline</i>  Algo deu errado!' +
                        '<p class="center">Tente novamente daqui a pouco...</p>' +
                        '</span>');
                    Materialize.toast($toastContent, 5000);

                });

        };

        $scope.clearProp = function () {
            $scope.newProp = {
                "title": "",
                "description": "",
                "addressReduce": {
                    "streetid": ""
                },
                "price": 0,
                "priceCatInterest": 0,
                "totalPrice": 0,

                "category": {
                    "categoryId": ""
                },

                "interest_category": "",

                "personReduce": {
                    "personId": ""
                },

                "image": [],
                "publish_date": "",
                "removel_date": ""
            }
        }
    }

    else {
        loginService.path = '/new';
        $location.path('/login')
    }

}]);


swApp.controller('profileController', ['$scope','httpq','$http','loginService','$location','$cookies', function ($scope,httpq,$http,loginService,$location,$cookies) {

    if(loginService.userLoged) {
        $scope.userID = loginService.user.personId
        //MONTANDO A PESSOA COMPLETA
        $scope.person = [{
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
        }];

        //OS DADOS ABAIXO SÃO CARREGADOS AO ACESSAR A PÁGINA
        httpq.get('http://10.11.0.96:8080/swapitws/rs/person/getbyID/' + $scope.userID)
            .then(function (data) {

                //ATUALIZA MODEL
                $scope.person = data;
            })
            .catch(function (response) {
            });

        //OS DADOS ABAIXO SÃO CARREGADOS AO BUSCAR CEP
        $scope.getAddress = function () {
            httpq.get('http://10.11.0.96:8080/swapitws/rs/street/getbycep/' + $scope.person.addressReduce.zipcode)
                .then(function (data) {

                    //ATUALIZA MODEL COM
                    $scope.person.addressReduce.streetid = data.streetid;
                    $scope.person.addressReduce.streetName = data.name;
                    $scope.person.addressReduce.complement = data.complement;
                    $scope.person.addressReduce.number = '';
                    $scope.person.addressReduce.districtName = data.district.name;
                    $scope.person.addressReduce.cityName = data.district.city.name;
                    $scope.person.addressReduce.stateAcronym = data.district.city.state.acronym;
                    $scope.person.addressReduce.stateName = data.district.city.state.name;
                    $scope.person.addressReduce.countryAcronym = data.district.city.state.country.acronym;
                    $scope.person.addressReduce.countryName = data.district.city.state.country.name;

                })
                .catch(function (response) {
                })
        };

        $scope.updatePerson = function () {
            $http.put('http://10.11.0.96:8080/swapitws/rs/person/update', $scope.person)

                .success(function (result) {
                    var $toastContent = $('<span>' +
                        '<i class="material-icons green-text">check</i>Cadastro Atualizado!' +
                        '</span>');
                    Materialize.toast($toastContent, 5000);

                })
                .error(function (data, status) {
                    var $toastContent = $('<span><i class="material-icons red-text">error_outline</i>  Algo deu errado!' +
                        '<p class="center">Tente novamente daqui a pouco...</p>' +
                        '</span>');
                    Materialize.toast($toastContent, 5000);

                });
        }

        $scope.removeAccount = function () {
            $scope.person.blocked = 1;
            $http.put('http://10.11.0.96:8080/swapitws/rs/person/update', $scope.person)

                .success(function (result) {
                    $cookies.remove('loginData');
                    loginService.userLoged = false;
                    loginService.user = {};
                    $location.path('/start');
                })
                .error(function (data, status) {
                    var $toastContent = $('<span><i class="material-icons red-text">error_outline</i>  Algo deu errado!' +
                        '<p class="center">Tente novamente daqui a pouco...</p>' +
                        '</span>');
                    Materialize.toast($toastContent, 5000);

                });
        }

        $scope.goBack = function () {
            $location.path('/main');
        }

    }
    else {
        loginService.path = '/profile';
        $location.path('/login');
    }
}]);

swApp.controller('proposalManagerController', ['$scope','httpq','$http','propService','$location','loginService', function ($scope,httpq,$http,propService,$location,loginService) {

    if(loginService.userLoged) {
        $scope.userID = loginService.user.personId
        $scope.userProps = [];
        $scope.singleProp = {};

        //BUSCA TODAS AS PROPOSTA DO USUÄRIO
        httpq.get('http://10.11.0.96:8080/swapitws/rs/proposition/getPropPerson/' + $scope.userID)

            .then(function (response) {
                $scope.userProps = response;
            })
            .catch(function (response) {

            });


        $scope.deleteProp = function (propositionId) {

            //BUSCA A PROPOSTA
            httpq.get('http://10.11.0.96:8080/swapitws/rs/proposition/getbyID/' + propositionId)

                .then(function (response) {
                    $scope.singleProp = response;

                    var d = new Date();
                    var e = new Date($scope.singleProp.publish_date);

                    var datestring = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
                    var datestring2 = e.getFullYear() + "-" + (e.getMonth() + 1) + "-" + e.getDate();

                    $scope.singleProp.publish_date = datestring2;
                    $scope.singleProp.removel_date = datestring;


                    //ATUALIZA A PROPOSTA
                    $http.put('http://10.11.0.96:8080/swapitws/rs/proposition/update', $scope.singleProp)

                        .success(function (response) {
                            var $toastContent = $('<span>' +
                                '<i class="material-icons green-text">check</i>Feito! :)' +
                                '</span>');
                            Materialize.toast($toastContent, 5000);

                            //ATUALIZA O ESCOPO DE PROPOSTAS DO USUÄRIO
                            httpq.get('http://10.11.0.96:8080/swapitws/rs/proposition/getPropPerson/' + $scope.userID)

                                .then(function (response) {
                                    $scope.userProps = response;
                                })
                                .catch(function (response) {

                                });
                        })

                        .error(function (response) {
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
    }
    else {
        loginService.path = '/propManager'
        $location.path('/login')
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


    httpq.get('http://10.11.0.96:8080/swapitws/rs/proposition/getbyID/'+$scope.propositionId)

        .then(function (response) {
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
            url: 'http://10.11.0.96:8080/swapitws/rs/propositionIMG/upload',
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
    httpq.get('http://10.11.0.96:8080/swapitws/rs/category/getAll')
        .then(function (data) {

            $scope.flatData = data;
            $scope.flatData3 = data;

            //Monta a arvore
            $scope.treedata = buildTree($scope.flatData, whereElementsIdIsInThisField, andTheReferenceToAParentIsInThisField, andSaveTheChildrenInThisField);
            $scope.treedata2 = buildTree(angular.copy($scope.flatData), whereElementsIdIsInThisField, andTheReferenceToAParentIsInThisField, andSaveTheChildrenInThisField);
            $scope.treedata3 = buildTree(angular.copy($scope.flatData3), whereElementsIdIsInThisField, andTheReferenceToAParentIsInThisField, andSaveTheChildrenInThisField);
        })

        .catch(function (response) {
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
        httpq.get('http://10.11.0.96:8080/swapitws/rs/street/getbycep/'+$scope.proposition.addressReduce.zipcode)
            .then(function (data) {
                $scope.proposition.addressReduce.streetid = data.streetid;
                $scope.district = data.district.name;
                $scope.city = data.district.city.name;
            })
            .catch(function (response) {
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


       $http.put('http://10.11.0.96:8080/swapitws/rs/proposition/update', $scope.proposition)
            .success(function (result) {
                var $toastContent = $('<span>' +
                    '<i class="material-icons green-text">check</i>Proposta atualizada com sucesso !' +
                    '</span>');
                Materialize.toast($toastContent, 5000);

                $location.path('/propManager')

            })
            .error(function (data, status) {
                var $toastContent = $('<span><i class="material-icons red-text">error_outline</i>  Algo deu errado!' +
                    '<p class="center">Tente novamente daqui a pouco...</p>' +
                    '</span>');
                Materialize.toast($toastContent, 5000);

            });
    };

}])

swApp.controller('sideMenuController', ['$scope','$routeParams','$http','httpq','$location','propService','loginService','$cookies', function ($scope,$routeParams,$http,httpq,$location,propService,loginService,$cookies) {

    // Perfect Scrollbar
    $('select').not('.disabled').material_select();
    var leftnav = $(".page-topbar").height();
    var leftnavHeight = window.innerHeight - leftnav;
    $('.leftside-navigation').height(leftnavHeight).perfectScrollbar({
        suppressScrollX: true
    });

    $scope.adm = false;
    $scope.$watch(function () {return loginService.userLoged},function () {
        $scope.userLoged = loginService.userLoged;
    })
    $scope.$watch(function () {return loginService.user},function () {
        $scope.admin = loginService.user.level;
    })
    $scope.$watch(function () {return loginService.user.personName},function () {
        $scope.userName = loginService.user.personName;
    })

    $scope.logout = function () {

        $cookies.remove('loginData');
        loginService.userLoged = false;
        loginService.user = {};
        $location.path('/start');

    }

    $scope.filters = {
        title:'',
        city:'',
        category:'',
        maxPrice:'',
        minPrice:''
    }

    $scope.cities = '';
    $scope.states = '';
    $scope.categories = '';

    $scope.selectedState = '00D9B42B-28B3-4FA3-B149-DCB3147BB0B8';
    $scope.selectedCity = null;

    $scope.title=null;
    $scope.category=propService.categoryId;
    $scope.city=null;
    $scope.price_max='';
    $scope.price_min='';


    //BUSCA TODOS OS ESTADOS
    httpq.get('http://10.11.0.96:8080/swapitws/rs/state/get')

        .then(function (response) {
            $scope.states = response;
        })
        .catch(function (response) {

        });

    //BUSCA AS CIDADES DO ESTADO SELECIONADO
    $scope.$watch('selectedState', function () {
        httpq.get('http://10.11.0.96:8080/swapitws/rs/city/getCityState/'+$scope.selectedState)

            .then(function (response) {
                $scope.cities = response;
            })
            .catch(function (response) {
            })
    });

    $scope.$watch('selectedCity', function () {
        if($scope.selectedCity !=null){
            propService.city = $scope.selectedCity;
            propService.selectedState = $scope.selectedState;;
        }

    });


    $scope.$watch(function () {return propService.category},function () {
        if($scope.category == null){

            httpq.get('http://10.11.0.96:8080/swapitws/rs/category/getParent/e1408c61-98bc-11e6-a3ce-80fa5b2affba')
                .then(function (response) {
                    $scope.categories = response;
                })
                .catch(function () {

                })
        }
        else {

            httpq.get('http://10.11.0.96:8080/swapitws/rs/category/getParent/'+$scope.category)
                .then(function (response) {
                    $scope.categories = response;
                })
                .catch(function () {

                })
        }
    })
    $scope.$watch(function () {return propService.category},function () {
        $scope.category = propService.category
    })
    
    $scope.setCategory = function (categoryid) {
        $scope.category = categoryid;
        propService.category = categoryid;
    }
    $scope.resetCategories = function () {
        $scope.category = 'e1408c61-98bc-11e6-a3ce-80fa5b2affba';
        propService.category = null;
    }
    $scope.searchByTitle = function () {

        if($scope.title == ''){
            propService.title = null;
        }
        else {
            propService.title = $scope.title;
        }

    }

    $scope.resetSearchByTitle = function () {
        propService.title = null;
        $scope.title = undefined;
    }

    $scope.searchByPrice = function () {
        if ($scope.price_max == ''){
            propService.price_max = 99999999999;
        }
        else {
            propService.price_max =$scope.price_max;
        }

        if ($scope.price_min == ''){
            propService.price_min = 0;
        }
        else {
            propService.price_min =$scope.price_min;
        }

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

swApp.controller('topNavController',['$scope','$cookies','$location','loginService',function ($scope,$cookies,$location,loginService) {

    $scope.adm = false;
    $scope.$watch(function () {return loginService.userLoged},function () {
        $scope.userLoged = loginService.userLoged;
    })
    $scope.$watch(function () {return loginService.user},function () {
        $scope.admin = loginService.user.level;
    })
    $scope.$watch(function () {return loginService.user.personName},function () {
        $scope.userName = loginService.user.personName;
    })

    $scope.logout = function () {

        $cookies.remove('loginData');
        loginService.userLoged = false;
        loginService.user = {};
        $location.path('/start');

    }

    $('.button-collapse').sideNav('show');

    $('.button-collapse').sideNav({
            menuWidth: 320, // Default is 240
            edge: 'left', // Choose the horizontal origin
            closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
            draggable: true // Choose whether you can drag to open on touch screens
        }
    );
    $('.collapsible').collapsible();
}])

swApp.controller('favoritesController', ['$scope', '$location', 'loginService', 'httpq','propService','$http', function ($scope, $location, loginService, httpq,propService, $http) {

    if (loginService.userLoged) {
        $scope.user = loginService.user
        $scope.userId = loginService.user.personId;
        $scope.rawFavs = [];
        $scope.propFavIds = [];
        $scope.favProps = [];
        $scope.person = '';


        $scope.getPersonFavs = function () {

            //LIMPA OS CAMPOS
            $scope.rawFavs = [];
            $scope.propFavIds = [];
            $scope.favProps = [];

            httpq.get('http://10.11.0.96:8080/swapitws/rs/person/getbyID/' + $scope.userId)
                .then(function (response) {

                    $scope.rawFavs = response.favorite;

                    for (var i = 0; i < $scope.rawFavs.length; i++) {
                        $scope.propFavIds.push($scope.rawFavs[i].propositionid)
                    }
                    for (var j = 0; j < $scope.propFavIds.length; j++) {
                        httpq.get('http://10.11.0.96:8080/swapitws/rs/proposition/getbyID/' + $scope.propFavIds[j])
                            .then(function (response) {
                                $scope.favProps.push(response)
                            })
                            .catch(function (response) {
                            })
                    }
                })
                .catch(function (response) {

                })
        }

        $scope.getPersonFavs();

        $scope.details = function (propId) {

            propService.propId = propId;
            $location.path('/details')
        }

        $scope.deleteFav = function (propId) {

            httpq.get('http://10.11.0.96:8080/swapitws/rs/person/getbyID/' + $scope.userId)
                .then(function (response) {

                    $scope.person = response;
                    $scope.rmFav = response.favorite;

                    for (var i = 0; i < $scope.rmFav.length; i++) {
                        if ($scope.rmFav[i].propositionid == propId) {
                            $scope.person.favorite.splice(i, 1);
                        }
                    }
                    $http.put('http://10.11.0.96:8080/swapitws/rs/person/update', $scope.person)
                        .success(function (result) {
                            var $toastContent = $('<span>' +
                                '<i class="material-icons green-text left">delete</i>Favorito removido!' +
                                '</span>');
                            Materialize.toast($toastContent, 5000);

                            $scope.getPersonFavs();

                        })
                        .error(function (data, status) {
                            var $toastContent = $('<span><i class="material-icons red-text left">error_outline</i>  Algo deu errado!' +
                                '<p class="center">Tente novamente daqui a pouco...</p>' +
                                '</span>');
                            Materialize.toast($toastContent, 5000);

                        });
                })

                .catch(function (response) {
                })
        }
    }
    else {
        loginService.path = '/favorite'
        $location.path('/login')
    }
}])

swApp.controller('admController',['$scope','$http','httpq','loginService','$location', function ($scope,$http,httpq,loginService,$location) {

    $scope.proposition = [];

    if (loginService.userLoged == true){
        if(loginService.user.level !== 'admin'){
            $location.path('/main')
        }
        $scope.user = loginService.user;

        $scope.getDenunces = function () {
            $scope.denuncedProps = [];
            httpq.get('http://10.11.0.96:8080/swapitws/rs/proposition/getDenunce/')
                .then(function (response) {
                    $scope.denuncedProps = response;
                })
                .catch(function (response) {
                })
        }

        $scope.getDenunces();


        //BLOQUEAR USER
        $scope.blockUser = function (userId) {
            httpq.get('http://10.11.0.96:8080/swapitws/rs/person/getbyID/'+ userId)
                .then(function (data) {

                    $scope.person = data;
                    $scope.person.blocked = 4;

                    $http.put('http://10.11.0.96:8080/swapitws/rs/person/update', $scope.person)
                        .success(function (result) {
                            var $toastContent = $('<span>' +
                                '<i class="material-icons red-text">block</i>Usuário Bloquado!' +
                                '</span>');
                            Materialize.toast($toastContent, 5000);
                            $scope.getDenunces();

                        })
                        .error(function (data, status) {
                            var $toastContent = $('<span><i class="material-icons red-text">error_outline</i>  Algo deu errado!' +
                                '<p class="center">Tente novamente daqui a pouco...</p>' +
                                '</span>');
                            Materialize.toast($toastContent, 5000);
                            $scope.getDenunces();

                        });
                })
                .catch(function (response) {
                });


        }

        $scope.removeProposal = function (propId) {

            httpq.get('http://10.11.0.96:8080/swapitws/rs/proposition/getbyID/'+propId)

                .then(function (response) {
                    $scope.proposition = response;

                    var e = new Date($scope.proposition.publish_date);
                    var datestringP = e.getFullYear() + "-" + (e.getMonth() + 1) + "-" + e.getDate();
                    $scope.proposition.publish_date = datestringP;


                    var d = new Date();
                    var datestring = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
                    $scope.proposition.removel_date = datestring;


                    $http.put('http://10.11.0.96:8080/swapitws/rs/proposition/update', $scope.proposition)
                        .success(function (result) {
                            var $toastContent = $('<span>' +
                                '<i class="material-icons green-text">delete</i>Poposta Removida!' +
                                '</span>');
                            Materialize.toast($toastContent, 5000);
                            $scope.getDenunces();
                        })
                        .error(function (data, status) {

                        });
                })
                .catch(function () {
                })



        }


        $scope.allowProposal = function (propId) {

            httpq.get('http://10.11.0.96:8080/swapitws/rs/proposition/getbyID/'+propId)

                .then(function (response) {

                    $scope.proposition = response;


                    var e = new Date($scope.proposition.publish_date);
                    var datestringP = e.getFullYear() + "-" + (e.getMonth() + 1) + "-" + e.getDate();
                    $scope.proposition.publish_date = datestringP;

                    delete $scope.proposition.denunce;
                    /* delete $scope.proposition.addressReduce.zipcode;
                    delete $scope.proposition.addressReduce.streetName;
                    delete $scope.proposition.addressReduce.complement;
                    delete $scope.proposition.addressReduce.districtName;
                    delete $scope.proposition.addressReduce.cityName;
                    delete $scope.proposition.addressReduce.stateAcronym;
                    delete $scope.proposition.addressReduce.stateName;
                    delete $scope.proposition.addressReduce.countryAcronym;
                    delete $scope.proposition.addressReduce.countryName;

                    delete $scope.proposition.category.categoryName;
                    delete $scope.proposition.category.parentId;
                    delete $scope.proposition.category.color;
                    delete $scope.proposition.category.icon;

                    delete $scope.proposition.interest_category.categoryName;
                    delete $scope.proposition.interest_category.parentId;
                    delete $scope.proposition.interest_category.color;
                    delete $scope.proposition.interest_category.icon;

                    delete $scope.proposition.personReduce.personName;
                    delete $scope.proposition.personReduce.personName;
                    delete $scope.proposition.personReduce.email;
                    delete $scope.proposition.personReduce.password;
                    delete $scope.proposition.personReduce.sex;
                    delete $scope.proposition.personReduce.blocked;
                    delete $scope.proposition.personReduce.level;
                    delete $scope.proposition.personReduce.favorite;
                    delete $scope.proposition.personReduce.phone;*/

                    $http.put('http://10.11.0.96:8080/swapitws/rs/proposition/update', $scope.proposition)
                        .success(function (result) {
                            var $toastContent = $('<span>' +
                                '<i class="material-icons green-text">check_all</i>Poposta Liberada!' +
                                '</span>');
                            Materialize.toast($toastContent, 5000);

                            $scope.getDenunces();
                        })
                        .error(function (data, status) {
                        });
                })
                .catch(function () {
                })



        }
    }


    else {
        loginService.path = '/'
        $location.path('/login')
    }
}])


