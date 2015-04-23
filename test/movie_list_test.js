describe('Movie list', function () {
    var controller, scope;

    var FirebaseServiceMock;

    beforeEach(function () {
        // Lisää moduulisi nimi tähän
        module('Elokuvakirjasto');

        FirebaseServiceMock = (function () {
            var movies = [
                {
                    name: 'test'
                },
                {
                    name: 'test2'
                }
            ];
            return {
                // Toteuta FirebaseServicen mockatut metodit tähän
                getMovies: function() {
                    return movies;
                }
            }
        })();

        // Lisää vakoilijat
        spyOn(FirebaseServiceMock, 'getMovies').and.callThrough();

        // Injektoi toteuttamasi kontrolleri tähän
        inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            // Muista vaihtaa oikea kontrollerin nimi!
            controller = $controller('MovieListController', {
                $scope: scope,
                FirebaseService: FirebaseServiceMock
            });
        });
    });

    /*
     * Testaa alla esitettyjä toimintoja kontrollerissasi
     */

    /*
     * Testaa, että Firebasesta (mockilta) saadut elokuvat löytyvät konrollerista
     * Testaa myös, että Firebasea käyttävästä palvelusta kutsutaan oikeaa funktiota,
     * käyttämällä toBeCalled-oletusta.
     */
    it('should list all movies from the Firebase', function () {
        expect(scope.movies.length).toBe(2);
        expect(scope.movies[0].name).toBe("test");
        expect(scope.movies[1].name).toBe("test2");
        expect(FirebaseServiceMock.getMovies).toHaveBeenCalled();
    });

    /* 
     * Testaa, että elokuvan pystyy poistamaan Firebasesta.
     * Testaa myös, että Firebasea käyttävästä palvelusta kutsutaan oikeaa funktiota,
     * käyttämällä toBeCalled-oletusta.
     */
    it('should be able to remove a movie', function () {
        expect(true).toBe(false);
    });
});