describe('Show movie', function () {
    var controller, scope;

    var FirebaseServiceMock, RouteParamsMock;

    beforeEach(function () {
        // Lisää moduulisi nimi tähän
        module('Elokuvakirjasto');

        FirebaseServiceMock = (function () {

            return {
                // Toteuta FirebaseServicen mockatut metodit tähän
                getMovie: function (key, done) {
                    var movies = {
                        "A123": {
                            name: "Pekka",
                            director: "Matti"
                        }
                    };
                    done(movies[key]);
                }
            }
        })();

        RouteParamsMock = (function () {
            return {
                key: 'A123'
            }
        })();

        spyOn(FirebaseServiceMock, 'getMovie').and.callThrough();

        // Injektoi toteuttamasi kontrolleri tähän
        inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            // Muista vaihtaa oikea kontrollerin nimi!
            controller = $controller('MovieViewController', {
                $scope: scope,
                $routeParams: RouteParamsMock,
                FirebaseService: FirebaseServiceMock
            });
        });

        // Lisää vakoilijat
        // spyOn(FirebaseServiceMock, 'jokuFunktio');
    });

    /*
     * Testaa alla esitettyjä toimintoja kontrollerissasi
     */

    /* 
     * Testaa, että Firebasesta (mockilta) saatu elokuva löytyy kontrollerista.
     * Testaa myös, että Firebasea käyttävästä palvelusta kutsutaan oikeaa funktiota
     * käyttämällä toBeCalled-oletusta.
     */
    it('should show current movie from Firebase', function () {
        expect(FirebaseServiceMock.getMovie).toHaveBeenCalled();
        expect(scope.movie.name).toBe("Pekka");
    });
});