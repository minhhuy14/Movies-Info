const express = require('express');

const router=express.Router();

 const homeController=require('../controllers/home.controller');

router.get('/',homeController.home);

router.get('/detailactor/:id',homeController.detailActor);
router.get('/detailmovie/:id', homeController.detailmovie);

router.get('/detailmovie/:movie_id/reviews/page/:page', homeController.getReviews);

router.get('/search',homeController.simpleSearch);
router.get('/search/:name/page/:page',homeController.searchMovie);

router.get('/search_actor',homeController.simpleSearchActor);
router.get('/search_actor/:name/page/:page',homeController.searchActor);


router.get('/myfavoritemovies',homeController.myFavorite);



module.exports = router;