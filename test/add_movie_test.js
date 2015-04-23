describe('Add movie', function () {
    var controller, scope;

    var FirebaseServiceMock;

    beforeEach(function () {
        // Lisää moduulisi nimi tähän
        module('Elokuvakirjasto');

        FirebaseServiceMock = (function () {
            var movies = [];
            return {
                // Toteuta FirebaseServicen mockatut metodit tähän
                addMovie: function (movie) {
                    movies.push(movie);
                },
                getMovies: function () {
                    return movies;
                }
            }
        })();

        // Injektoi toteuttamasi kontrolleri tähän
        inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            // Muista vaihtaa oikea kontrollerin nimi!
            controller = $controller('MovieAddController', {
                $scope: scope,
                FirebaseService: FirebaseServiceMock
            });
        });

        // Lisää vakoilijat
        spyOn(FirebaseServiceMock, 'addMovie');
    });

    /*
     * Testaa alla esitettyjä toimintoja kontrollerissasi
     */

    /*
     * Testaa, että käyttäjä pystyy lisäämään elokuvan oikeilla tiedoilla.
     * Muista myös tarkistaa, että Firebasen kanssa keskustelevasta palvelusta
     * on kutsutta oikeaa funktiota lisäämällä siihen vakoilijan ja käyttämällä
     * toBeCalled-oletusta.
     */
    it('should be able to add a movie by its name, director, release date and description', function () {
        scope.user = {};
        scope.user.name = 'Test';
        scope.user.director = 'Test';
        scope.user.year = 73571;
        scope.user.description = 'Test';
        scope.addMovie(scope.user);
        expect(FirebaseServiceMock.addMovie).toHaveBeenCalled();
    });

    /*	
     * Testaa, ettei käyttäjä pysty lisäämään elokuvaa väärillä tiedoilla.
     * Muista myös tarkistaa, että Firebasen kanssa keskustelevasta palvelusta
     * EI kutsuta funktiota, joka hoitaa muokkauksen. Voit käyttää siihen
     * not.toBeCalled-oletusta (muista not-negaatio!).
     */
    it('should not be able to add a movie if its name, director, release date or description is empty', function () {
        scope.user = {};
        scope.user.name = '';
        scope.user.director = 'Test';
        scope.user.year = 73571;
        scope.user.description = 'Test';
        scope.addMovie(scope.user);
        expect(FirebaseServiceMock.addMovie).not.toHaveBeenCalled();
    });
});