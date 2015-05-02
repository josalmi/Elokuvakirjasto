// Toteuta moduulisi tänne

var Elokuvakirjasto = angular.module('Elokuvakirjasto', ['ngRoute', 'firebase']);

Elokuvakirjasto.service('FirebaseService', function ($firebase) {

    var firebaseRef = new Firebase('https://elokuvakirjasto.firebaseio.com/movies');
    var sync = $firebase(firebaseRef);
    var movies = sync.$asArray();

    this.getMovies = function () {
        return movies;
    };

    this.addMovie = function (movie) {
        movies.$add(movie);
    };

    this.getMovie = function (key, done) {
        movies.$loaded(function () {
            done(movies.$getRecord(key));
        });
    };

    this.save = function (movie) {
        movies.$save(movie);
    };

    this.remove = function (movie) {
        movies.$remove(movie);
    };
});

Elokuvakirjasto.service('Omdb', function ($http) {
    this.findMovies = function (options) {
        return $http.get('http://www.omdbapi.com', {params: options});
    };
});

Elokuvakirjasto.service('AuthenticationService', function ($firebase, $firebaseAuth) {
    var firebaseRef = new Firebase('https://elokuvakirjasto.firebaseio.com');
    var firebaseAuth = $firebaseAuth(firebaseRef);

    this.logUserIn = function (email, password) {
        return firebaseAuth.$authWithPassword({
            email: email,
            password: password
        });
    }

    this.createUser = function (email, password) {
        return firebaseAuth.$createUser({
            email: email,
            password: password
        });
    };

    this.checkLoggedIn = function () {
        return firebaseAuth.$waitForAuth();
    };

    this.logUserOut = function () {
        firebaseAuth.$unauth();
    };

    this.getUserLoggedIn = function () {
        return firebaseAuth.$getAuth();
    };
});

Elokuvakirjasto.controller('UserController', function($scope, $location, AuthenticationService, $rootScope){
  
  $scope.logIn = function(){
    AuthenticationService.logUserIn($scope.email, $scope.password)
    .then(function(){
      $rootScope.userLoggedIn = true;
      $location.path('/movies');
    })
    .catch(function(){
      $scope.loginMessage = 'Invalid email address or password!'
    });
  }

  $scope.register = function(){
    AuthenticationService.createUser($scope.newEmail, $scope.newPassword)
    .then(function(){
      AuthenticationService.logUserIn($scope.newEmail, $scope.newPassword)
      .then(function(){
        $rootScope.userLoggedIn = true;
        $location.path('/movies');
      });
    })
    .catch(function(){
      $scope.registerMessage = 'Error! Try again later!';
    });
  }
});

Elokuvakirjasto.controller('MovieListController', function ($scope, FirebaseService, currentAuth, Omdb) {
    $scope.movies = FirebaseService.getMovies();

    $scope.removeMovie = function (movie) {
        if(!currentAuth) {
            return;
        }
        FirebaseService.remove(movie);
    };

    $scope.findMovies = function () {
        Omdb.findMovies($scope.options).success(function (movies) {
            $scope.omdbMovies = movies.Search || [];
        });
    };
});

Elokuvakirjasto.controller('MovieAddController', function ($scope, $location, FirebaseService, currentAuth) {
    if (!currentAuth) {
        $location.path('/login');
    }
    $scope.addMovie = function (movie) {
        if (!movie.name || !movie.director || !movie.year || !movie.description) {
            return;
        }
        FirebaseService.addMovie(movie);
        $location.path('/movies');
    }
});

Elokuvakirjasto.controller('MovieShowController', function ($scope, $routeParams, FirebaseService) {
    FirebaseService.getMovie($routeParams.key, function (data) {
        $scope.movie = data;
    });
});

Elokuvakirjasto.controller('MovieEditController', function ($scope, $routeParams, $location, FirebaseService, currentAuth) {
    if (!currentAuth) {
        $location.path('/login');
    }
    FirebaseService.getMovie($routeParams.key, function (data) {
        $scope.movie = data;
    });

    $scope.editMovie = function (movie) {
        if (!movie.name || !movie.director || !movie.year || !movie.description) {
            return;
        }
        FirebaseService.save(movie);
        $location.path('/movies');
    };
});

Elokuvakirjasto.config(function ($routeProvider) {
    $routeProvider
            .when('/movies', {
                controller: 'MovieListController',
                templateUrl: 'app/templates/list.html',
                resolve: {
                    currentAuth: function (AuthenticationService) {
                        return AuthenticationService.checkLoggedIn();
                    }
                }
            })
            .when('/movies/new', {
                controller: 'MovieAddController',
                templateUrl: 'app/templates/add.html',
                resolve: {
                    currentAuth: function (AuthenticationService) {
                        return AuthenticationService.checkLoggedIn();
                    }
                }
            })
            .when('/movies/:key', {
                controller: 'MovieShowController',
                templateUrl: 'app/templates/show.html'
            })
            .when('/movies/:key/edit', {
                controller: 'MovieEditController',
                templateUrl: 'app/templates/edit.html',
                resolve: {
                    currentAuth: function (AuthenticationService) {
                        return AuthenticationService.checkLoggedIn();
                    }
                }
            })
            .when('/login', {
                controller: 'UserController',
                templateUrl: 'app/templates/login.html'
            })
            .otherwise({
                redirectTo: '/movies'
            });
    ;
});


Elokuvakirjasto.config(['$httpProvider', function ($httpProvider) {
        delete $httpProvider.defaults.headers.common["X-Requested-With"]
    }]);

Elokuvakirjasto.run(function (AuthenticationService, $rootScope) {
    $rootScope.logOut = function () {
        AuthenticationService.logUserOut();
        $rootScope.userLoggedIn = false;
    };

    $rootScope.userLoggedIn = AuthenticationService.getUserLoggedIn();
});