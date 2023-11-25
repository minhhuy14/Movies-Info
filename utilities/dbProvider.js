const { create } = require('domain');
const fs = require('fs/promises');

const pgp = require('pg-promise')({
    capSQL: true
});


const origin_connect = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    max: 30
}

const db = pgp(origin_connect);

const new_connect = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    max: 30
}
const newDB = pgp(new_connect);

module.exports = {
    db,
    removeDuplicates: function (data) {
        let jsonObject = data.map(JSON.stringify);
        let uniqueSet = new Set(jsonObject);
        let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
        return uniqueArray;
    },
    readDataFromFile: async function (fileName) {

        let path = `./db/${fileName}.json`;
        //  console.log(path);

        try {
            const data = await fs.readFile(path, { encoding: 'utf8' });
            // console.log('read data:');
            // console.log(data.length);
            return JSON.parse(data);
        }
        catch (err) {
            console.error(err);
            return null;
        }

    },

    createTable: async (table_name, columns) => {
        let db_connection = null;

        try {
            db_connection = await newDB.connect();

            const query = `CREATE TABLE IF NOT EXISTS ${table_name} (${columns})`;
            await db_connection.any(query);
            console.log(`Created table ${table_name} successfully`);
        } catch (error) {
            throw (error);
        } finally {
            db_connection.done();
        }
    },

    createAndImportDataToDatabase: async function () {

        let movies_columns = `
        id TEXT PRIMARY KEY,
        img TEXT,
        title TEXT,
        year INT,
        topRank INT,
        rating DOUBLE PRECISION,
        ratingCount DOUBLE PRECISION,
        genres TEXT []
    `

        await this.createTable('Movies', movies_columns);

        const query = 'INSERT INTO Movies(id,img,title,year,topRank,rating,ratingCount,genres) VALUES($1,$2,$3,$4,$5,$6,$7,$8)';
        const value = [
            '1',
            'https://m.media-amazon.com/images/M/MV5BMTYwNjE4MTYxMl5BMl5BanBnXkFtZTYwMTk3MjY3._V1_.jpg',
            'The Shawshank Redemption',
            1994,
            1,
            9.2,
            239,
            ['Drama']
        ];
        newDB.none(query, value);

    },

    initDatabase: async function () {
        let db_connection = null;

        try {
            db_connection = await db.connect();
            console.log(db_connection);

            const checkDatabaseQuery = `SELECT datname FROM pg_database WHERE datname='${process.env.DB_NAME}'`;

            const checkDatabaseResult = await db_connection.any(checkDatabaseQuery);
            if (checkDatabaseResult.length === 0) {
                const createDatabaseQuery = `CREATE DATABASE ${process.env.DB_NAME}`;
                await db_connection.any(createDatabaseQuery);
                console.log(`Created database ${process.env.DB_NAME} successfully`);
                db_connection.done();


                db_connection = await newDB.connect();
                console.log(db_connection);

                let data = await this.readDataFromFile('data');

                await this.createAndImportDataToDatabase();

            }
            else {
                db_connection.done();
                // const new_connect={
                //     host:process.env.DB_HOST,
                //     port:process.env.DB_PORT,
                //     database:process.env.DB_NAME,
                //     user:process.env.DB_USER,
                //     password:process.env.DB_PW,
                //     max:30
                // }
                // const newDB=pgp(new_connect);

                db_connection = await newDB.connect();
                console.log('case 2');
                console.log(db_connection);
                console.log(`Database ${process.env.DB_NAME} already exists`);


            }

        }
        catch (error) {
            throw (error);
        }
        finally {
            db_connection.done();
        }

    }
}