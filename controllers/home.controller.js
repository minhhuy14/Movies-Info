const {getTop05RatingMovies,getTop15BoxOfficeMovies,getMovieById}=require('../models/home.model');

exports.home=async (req,res)=>{
    try{
         
             let resultTopRating=await getTop05RatingMovies();
            //  console.log(resultTopRating);
            for (let i=0;i<resultTopRating.length;i++){
                resultTopRating[i].show_id=i;
                if (i==0)
                {
                    resultTopRating[i].tempvalue=true;
                }
                else {
                    resultTopRating[i].tempvalue=false;
                }

               
                // console.log(resultTopRating[i].tempvalue);
                // console.log(resultTopRating[i].show_id);
            }

            let resultTopBoxOffice=await getTop15BoxOfficeMovies();

            let groupview={};

            let topboxoffice=[];

            for (let i=0;i<resultTopBoxOffice.length;i=i+3){

                groupview.first_movie=resultTopBoxOffice[i];
                groupview.second_movie=resultTopBoxOffice[i+1];
                groupview.third_movie=resultTopBoxOffice[i+2];
                groupview.show_id=i/3;
                if (i==0)
                {
                    groupview.tempvalue=true;
                }
                else {
                    groupview.tempvalue=false;
                }

                topboxoffice.push(groupview);
                groupview={};
            }
            // console.log('length');
            // console.log(topboxoffice.length);
             res.render('index',
             {   results:resultTopRating,
                 topboxoffice:topboxoffice
            });
            
        
    }
    catch(err){
         console.log(err);
         res.status(500).send('Error while query top rating');
    }
};


exports.detailmovie=async (req,res)=>{
    try{
        const id=req.params.id;
        const reviewPage=req.params.reviewpage||1;
        const selectedPage=req.params.page||1;

        let movie=await getMovieById(id);
    // console.log(movie.generalData[0].title);
    
        //  console.log(movie.castList);
        //  console.log(movie.reviewList[1].helpfulnessscore);
         let generalData=movie.generalData[0];
        //  console.log(generalData.length);
         let reviewsData=movie.reviewList;

         let totalReviews=reviewsData.length;
         let reviewsPerPage=2;
        let totalReviewsPages=Math.floor((totalReviews/reviewsPerPage)+((totalReviews%reviewsPerPage)==0?0:1));
        // console.log(totalReviewsPages+'total Reviews Pages');
        let arrayReviewsPages=[];
        for (let i=1; i<=totalReviewsPages; i++){
            arrayReviewsPages.push(i);
        }

        reviewsData=reviewsData.slice(reviewPage*2-2, reviewPage*2);

        //  console.log('review length: '+reviewsData.length);
        
         let castsData=movie.castList;
        //  console.log(castsData);
        let totalItems=castsData.length;
        let itemsPerPage=10;
        let totalPages=Math.floor((totalItems/itemsPerPage)+((totalItems%itemsPerPage)==0?0:1));
        // console.log(totalPages);
        // console.log(typeof totalPages);
        let arrayPages=[];
        for (let i=1; i<=totalPages; i++){
            arrayPages.push(i);
        }
        // let temp=castsData.slice(selectedPage*10-10, selectedPage*10);
        // console.log(temp[0].movie_id);
        // console.log(castsData);
        // console.log(arrayPages);

        let genres_data=movie.genreList;

        // console.log(genres_data);
        // console.log(reviewPage);

        res.render('detailmovie',{generaldata: generalData,
                                    reviewsdata: reviewsData,
                                    castsdata: castsData.slice(selectedPage*10-10, selectedPage*10),
                                     listpages:arrayPages,
                                    currentpage:parseInt(selectedPage),
                                    movie_id:castsData[0].movie_id,
                                    current_review_page:parseInt(reviewPage),
                                    list_review_pages:arrayReviewsPages,
                                    genres_data:genres_data
        });
    }
    catch(err){
        console.log(err);
        res.status(500).send('Error while get detail movie by id');
    }

   
}

exports.getReviews = async (req, res) => {
    console.log('getReviews');
    console.log(req.params);
    const movieId = req.params.movie_id;
    const page = req.params.page || 1;
    const reviewsPerPage = 2;

    let movie = await getMovieById(movieId);
    let reviewsData = movie.reviewList;
    let totalReviews = reviewsData.length;
    let totalReviewsPages = Math.floor((totalReviews/reviewsPerPage) + ((totalReviews%reviewsPerPage) == 0 ? 0 : 1));
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