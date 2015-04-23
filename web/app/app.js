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
});

Elokuvakirjasto.controller('MovieListController', function ($scope, FirebaseService) {
    $scope.movies = FirebaseService.getMovies();
});

Elokuvakirjasto.controller('MovieAddController', function ($scope, $location, FirebaseService) {
    $scope.addMovie = function (movie) {
        if (!movie.name || !movie.director || !movie.year || !movie.year) {
            return;
        }
        FirebaseService.addMovie(movie);
        $location.path('/movies');
    }
});

Elokuvakirjasto.config(function ($routeProvider) {
    $routeProvider
            .when('/movies', {
                controller: 'MovieListController',
                templateUrl: '/app/templates/list.html'
            })
            .when('/movies/new', {
                controller: 'MovieAddController',
                templateUrl: '/app/templates/add.html'
            })
            .otherwise({
                redirectTo: '/movies'
            });
    ;
});
