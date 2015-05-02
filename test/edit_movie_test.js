describe('Edit movie', function () {
    var controller, scope;

    var FirebaseServiceMock, RouteParamsMock;

    beforeEach(function () {
        // Lisää moduulisi nimi tähän
        module('Elokuvakirjasto');

        FirebaseServiceMock = (function () {
            var movies = {
                "A123": {
                    $key: "A123",
                    name: "Pekka",
                    director: "Matti",
                    year: 2080,
                    description: "Desc"
                }
            };

            return {
                // Toteuta FirebaseServicen mockatut metodit tähän
                getMovie: function (key, done) {
                    done(movies[key]);
                },
                save: function (movie) {
                    if (movies[movie.$key] !== undefined)
                        movies[movie.$key] = movie;
                    console.log(movies[movie.$key]);
                }
            }
        })();


        RouteParamsMock = (function () {
            return {
                key: 'A123'
            }
        })();


        spyOn(FirebaseServiceMock, 'getMovie').and.callThrough();
        spyOn(FirebaseServiceMock, 'save').and.callThrough();


        // Injektoi toteuttamasi kontrolleri tähän
        inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            // Muista vaihtaa oikea kontrollerin nimi!
            controller = $controller('MovieEditController', {
                $scope: scope,
                FirebaseService: FirebaseServiceMock,
                $routeParams: RouteParamsMock
            });
        });

        // Lisää vakoilijat
        // spyOn(FirebaseServiceMock, 'jokuFunktio');
    });

    /*
     * Testaa alla esitettyjä toimintoja kontrollerissasi
     */

    /*
     * Testaa, että muokkauslomakkeen tiedot täytetään muokattavan elokuvan tiedoilla.
     * Testaa myös, että Firebasea käyttävästä palvelusta kutsutaan oikeaa funktiota,
     * käyttämällä toBeCalled-oletusta.
     */
    it('should fill the edit form with the current information about the movie', function () {
        expect(scope.movie.name).toBe("Pekka");
        expect(scope.movie.director).toBe("Matti");
        expect(scope.movie.year).toBe(2080);
        expect(scope.movie.description).toBe("Desc");
        expect(FirebaseServiceMock.getMovie).toHaveBeenCalled();
    });

    /* 
     * Testaa, että käyttäjä pystyy muokkaamaan elokuvaa, jos tiedot ovat oikeat
     * Testaa myös, että Firebasea käyttävästä palvelusta kutsutaan oikeaa funktiota,
     * käyttämällä toBeCalled-oletusta.
     */
    it('should be able to edit a movie by its name, director, release date and description', function () {
        scope.editMovie({
            $key: "A123",
            name: "Pekka2",
            director: "Matti2",
            year: 2081,
            description: "Desc2"
        });
        expect(FirebaseServiceMock.save).toHaveBeenCalled();
    });

    /*
     * Testaa, ettei käyttäjä pysty muokkaaman elokuvaa, jos tiedot eivät ole oikeat
     * Testaa myös, että Firebasea käyttävästä palvelusta ei kutsuta muokkaus-funktiota,
     * käyttämällä not.toBeCalled-oletusta.
     */
    it('should not be able to edit a movie if its name, director, release date or description is empty', function () {
        scope.editMovie({
            $key: "A123",
            name: "Pekka2",
            director: "Matti2",
            year: 2081,
            description: ""
        });
        expect(FirebaseServiceMock.save).not.toHaveBeenCalled();
    });
});