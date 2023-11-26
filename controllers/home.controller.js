const {getTop05RatingMovies,getMovieById}=require('../models/home.model');

exports.home=async (req,res)=>{
    try{
         
             let resultTopRating=await getTop05RatingMovies();
             let zero=1;
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

               
                console.log(resultTopRating[i].tempvalue);
                console.log(resultTopRating[i].show_id);
            }
            
             res.render('index',
             {   results:resultTopRating,
                zero

            });
            
        
    }
    catch(err){
         console.log(err);
         res.status(500).send('Error while query top rating');
    }
};
