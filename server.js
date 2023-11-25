require('dotenv').config();

const express=require('express');

const path=require('path');
const db=require('./utilities/dbProvider.js');

const PORT=process.env.PORT || 21177;

const app=express();

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.use(express.json());

// const homeRouter=require('./routes/home.router');

// app.use('/',homeRouter);
db.initDatabase();

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});


