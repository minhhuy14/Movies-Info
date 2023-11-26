const {getTop05RatingMovies,getTop15BoxOfficeMovies}=require('../models/home.model');

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

               
                console.log(resultTopRating[i].tempvalue);
                console.log(resultTopRating[i].show_id);
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
            console.log('length');
            console.log(topboxoffice.length);
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
