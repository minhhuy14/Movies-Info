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
    static async getMovieById(m_id){
        try {
            let data = await db.getMovieInfo(m_id);
            
            return data;

        } catch (error) {
            throw error;
        }
    }
}

module.exports = QueryMovies;