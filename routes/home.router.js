const express = require('express');

const router=express.Router();

 const homeController=require('../controllers/home.controller');

router.get('/',homeController.home);

router.get('/detailactor/:id',homeController.detailActor);
router.get('/detailmovie/:id', homeController.detailmovie);

router.get('/detailmovie/:movie_id/reviews/page/:page', homeController.getReviews);


module.exports = router;