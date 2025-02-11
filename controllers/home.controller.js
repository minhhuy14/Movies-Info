const { getTop05RatingMovies, getTop15BoxOfficeMovies, getTop15FavoriteMovies, getActorById, getMovieByNameOrGenre, getMovieById, getFavoriteMoviesList, getActorInfoByNames } = require('../models/home.model');

exports.home = async (req, res) => {
    try {

        let resultTopRating = await getTop05RatingMovies();
        //  console.log(resultTopRating);
        for (let i = 0; i < resultTopRating.length; i++) {
            resultTopRating[i].show_id = i;
            if (i == 0) {
                resultTopRating[i].tempvalue = true;
            }
            else {
                resultTopRating[i].tempvalue = false;
            }


            // console.log(resultTopRating[i].tempvalue);
            // console.log(resultTopRating[i].show_id);
        }

        let resultTopBoxOffice = await getTop15BoxOfficeMovies();

        let groupview = {};

        let topboxoffice = [];

        for (let i = 0; i < resultTopBoxOffice.length; i = i + 3) {

            groupview.first_movie = resultTopBoxOffice[i];
            groupview.second_movie = resultTopBoxOffice[i + 1];
            groupview.third_movie = resultTopBoxOffice[i + 2];
            groupview.show_id = i / 3;
            if (i == 0) {
                groupview.tempvalue = true;
            }
            else {
                groupview.tempvalue = false;
            }

            topboxoffice.push(groupview);
            groupview = {};
        }
        // console.log('length');
        // console.log(topboxoffice.length);


        let resultTopFavorite = await getTop15FavoriteMovies();

        // console.log(resultTopFavorite.length);

        let groupview2 = {};

        let topfavorite = [];
        for (let i = 0; i < resultTopFavorite.length; i = i + 3) {

            groupview2.first_movie = resultTopFavorite[i];
            groupview2.second_movie = resultTopFavorite[i + 1];
            groupview2.third_movie = resultTopFavorite[i + 2];
            groupview2.show_id = i / 3;
            if (i == 0) {
                groupview2.tempvalue = true;
            }
            else {
                groupview2.tempvalue = false;
            }

            topfavorite.push(groupview2);
            groupview2 = {};
        }

        // console.log(topfavorite.length);

        res.render('index',
            {
                results: resultTopRating,
                topboxoffice: topboxoffice,
                topfavorite: topfavorite
            });


    }
    catch (err) {
        console.log(err);
        res.status(500).send('Error while query top rating');
    }
};


exports.detailmovie = async (req, res) => {
    try {
        const id = req.params.id;
        // console.log('detailmovie');
        // console.log(id);
        const reviewPage = req.params.reviewpage || 1;
        const selectedPage = req.params.page || 1;

        let movie = await getMovieById(id);
        // console.log(movie.generalData[0].title);

        //  console.log(movie.castList);
        //  console.log(movie.reviewList[1].helpfulnessscore);
        let generalData = movie.generalData[0];
        //  console.log(generalData.length);
        let reviewsData = movie.reviewList;

        let totalReviews = reviewsData.length;
        let reviewsPerPage = 2;
        let totalReviewsPages = Math.floor((totalReviews / reviewsPerPage) + ((totalReviews % reviewsPerPage) == 0 ? 0 : 1));
        // console.log(totalReviewsPages+'total Reviews Pages');
        let arrayReviewsPages = [];
        for (let i = 1; i <= totalReviewsPages; i++) {
            arrayReviewsPages.push(i);
        }

        reviewsData = reviewsData.slice(reviewPage * 2 - 2, reviewPage * 2);

        //  console.log('review length: '+reviewsData.length);

        let castsData = movie.castList;
        //  console.log(castsData);
        let totalItems = castsData.length;
        let itemsPerPage = 10;
        let totalPages = Math.floor((totalItems / itemsPerPage) + ((totalItems % itemsPerPage) == 0 ? 0 : 1));
        // console.log(totalPages);
        // console.log(typeof totalPages);
        let arrayPages = [];
        for (let i = 1; i <= totalPages; i++) {
            arrayPages.push(i);
        }
        // let temp=castsData.slice(selectedPage*10-10, selectedPage*10);
        // console.log(temp[0].movie_id);
        // console.log(castsData);
        // console.log(arrayPages);

        let genres_data = movie.genreList;

        // console.log(genres_data);
        // console.log(reviewPage);

        res.render('detailmovie', {
            generaldata: generalData,
            reviewsdata: reviewsData,
            castsdata: castsData.slice(selectedPage * 10 - 10, selectedPage * 10),
            listpages: arrayPages,
            currentpage: parseInt(selectedPage),
            movie_id: id,
            current_review_page: parseInt(reviewPage),
            list_review_pages: arrayReviewsPages,
            genres_data: genres_data
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Error while get detail movie by id');
    }


}

exports.getReviews = async (req, res) => {
    // console.log('getReviews');
    // console.log(req.params);
    const movieId = req.params.movie_id;
    const page = req.params.page || 1;
    const reviewsPerPage = 2;

    let movie = await getMovieById(movieId);
    let reviewsData = movie.reviewList;
    let totalReviews = reviewsData.length;
    let totalReviewsPages = Math.floor((totalReviews / reviewsPerPage) + ((totalReviews % reviewsPerPage) == 0 ? 0 : 1));
    let arrayReviewsPages = [];
    for (let i = 1; i <= totalReviewsPages; i++) {
        arrayReviewsPages.push(i);
    }

    reviewsData = reviewsData.slice(page * 2 - 2, page * 2);

    res.json({
        reviewsData: reviewsData,
        currentReviewPage: parseInt(page),
        listReviewPages: arrayReviewsPages
    });
};

exports.detailActor = async (req, res) => {
    try {
        const id = req.params.id;
        let actor = await getActorById(id);
        // console.log(actor);
        let generalData = actor.generalData[0];
        let movieList = actor.movieList;
        // console.log(generalData);
        // console.log(movieList);
        res.render('detailactor',
            {
                general_data: generalData,
                movie_list: movieList
            });
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Error while get detail actor by id');
    }
}

exports.searchMovie = async (req, res) => {
    try {
        const name = req.params.name;
        const page = req.params.page || 1;
        const itemsPerPage = 4;


        // console.log(name);
        let movies = await getMovieByNameOrGenre(name);
        // console.log(movies);



        // console.log(movies.length);
        const uniqueMovieIds = [...new Set(movies.map(movie => movie.id))];
        //    console.log(uniqueMovieIds);

        movies = removeDuplicates(movies, 'id');
        let total_results = movies.length;
        let totalResultPages = Math.floor((total_results / itemsPerPage) + ((total_results % itemsPerPage) == 0 ? 0 : 1));
        let arrayResultPages = [];
        for (let i = 1; i <= totalResultPages; i++) {
            arrayResultPages.push(i);
        }

        movies = movies.slice(page * 4 - 4, page * 4);
        //    console.log(movies.length);
        res.render('searchmovie',
            {
                movies: movies,
                current_page: parseInt(page),
                total_results: total_results,
                list_pages: arrayResultPages,
                search_value: name
            });
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Error while search movie by name');
    }
}

exports.myFavorite = async (req, res) => {
    try {
        let movies = await getFavoriteMoviesList();
        // console.log(movies);
        res.render('myfavoritemovies',
            {
                movies: movies
            });
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Error while get favorite movies');
    }
}
function removeDuplicates(arr, prop) {
    return arr.filter((movie, index, self) =>
        index === self.findIndex((m) => m[prop] === movie[prop])
    );
}

exports.simpleSearch = async (req, res) => {
    try {
        const name = req.query.search_value;
        const page = req.params.page || 1;
        const itemsPerPage = 4;


        // console.log(name);
        let movies = await getMovieByNameOrGenre(name);
        // console.log(movies);



        // console.log(movies.length);
        const uniqueMovieIds = [...new Set(movies.map(movie => movie.id))];
        //    console.log(uniqueMovieIds);

        movies = removeDuplicates(movies, 'id');
        let total_results = movies.length;
        let totalResultPages = Math.floor((total_results / itemsPerPage) + ((total_results % itemsPerPage) == 0 ? 0 : 1));
        let arrayResultPages = [];
        for (let i = 1; i <= totalResultPages; i++) {
            arrayResultPages.push(i);
        }

        // console.log(arrayResultPages);
        movies = movies.slice(page * 4 - 4, page * 4);
        //    console.log(movies.length);
        res.render('searchmovie',
            {
                movies: movies,
                current_page: parseInt(page),
                total_results: total_results,
                list_pages: arrayResultPages,
                search_value: name
            });
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Error while search movie by name');
    }
}

exports.simpleSearchActor = async (req, res) => {
    try {
        const name = req.query.search_value;
        const page = req.params.page || 1;
        const itemsPerPage = 4;
        let actors = await getActorInfoByNames(name);
        // console.log(actors);
        let total_results = actors.length;
        let totalResultPages = Math.floor((total_results / itemsPerPage) + ((total_results % itemsPerPage) == 0 ? 0 : 1));
        let arrayResultPages = [];
        for (let i = 1; i <= totalResultPages; i++) {
            arrayResultPages.push(i);
        }
        actors = actors.slice(page * 4 - 4, page * 4);
        res.render('search_actor',
            {
                actors: actors,
                search_value: name,
                current_page: parseInt(page),
                list_pages: arrayResultPages,
                total_results: total_results
            })

    } catch (err) {
        console.log(err);
        res.status(500).send('Error while search actor by name');
    }
}

exports.searchActor = async (req, res) => {
    try {
        const name = req.params.name;
        const page = req.params.page || 1;
        const itemsPerPage = 4;
        let actors = await getActorInfoByNames(name);
        // console.log(actors);
        let total_results = actors.length;
        let totalResultPages = Math.floor((total_results / itemsPerPage) + ((total_results % itemsPerPage) == 0 ? 0 : 1));
        let arrayResultPages = [];
        for (let i = 1; i <= totalResultPages; i++) {
            arrayResultPages.push(i);
        }
        actors = actors.slice(page * 4 - 4, page * 4);
        res.render('search_actor',
            {
                actors: actors,
                search_value: name,
                current_page: parseInt(page),
                list_pages: arrayResultPages,
                total_results: total_results
            })

    } catch (err) {
        console.log(err);
        res.status(500).send('Error while search actor by name');
    }
}