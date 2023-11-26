require('dotenv').config();

const express=require('express');

const path=require('path');
const db=require('./utilities/dbProvider.js');

const PORT=process.env.PORT || 21177;

const app=express();

const myTemplateEngine=require('./21177.js');
const engine = new myTemplateEngine();


engine.registerTemplate('myLoopTemplate', `
21177{for item in items}
    21177{if item }
            <p>TRUE</p>
            21177{if item }
                    <p>TRUE 2</p>
        {else}
            <p>FALSE</p>
    {/if}
{/for}
`);

// let output = engine.render('myTemplate', { x: false });

// console.log(output); 

// engine.registerTemplate('myLoopTemplate', `
//     21177{for item in items }
//     <p>21177{ item }</p>
//     {/for}
// `);

// // Render the template with some data
 let output = engine.render('myLoopTemplate', { items:[ true, false, false, true] });
  console.log(output);  // Should print "<p>Item 1</p><p>Item 2</p><p>Item 3</p>"

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.use(express.json());

// const homeRouter=require('./routes/home.router');

// app.use('/',homeRouter);
db.initDatabase();

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});


