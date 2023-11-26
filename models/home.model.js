const db=require('../utilities/dbProvider.js');

class QueryMovies{
    static async getTop05RatingMovies(){

        try {
            let data = await db.queryTop05RatingMovies();
            
            return data;

        } catch (error) {
            throw error;
        }
    }
    static async getTop15BoxOfficeMovies(){
        try{
            let data = await db.queryTop15BoxOfficeMovies();
            return data;
        }
        catch(error){
            throw error;
        }

    }
    static async getMovieById(m_id){
        try {
            let data = await db.getMovieInfo(m_id);
            
            return data;

        } catch (error) {
            throw error;
        }
    }
    static async getActorById(a_id){
        try {
            let data = await db.getActorInfo(a_id);
            
            return data;

        } catch (error) {
            throw error;
        }
    }
    static async getMovieByNameOrGenre(name){
        try {
            let data = await db.getMovieByNameOrGenre(name);
            
            return data;

        } catch (error) {
            throw error;
        }
    }
}

module.exports = QueryMovies;