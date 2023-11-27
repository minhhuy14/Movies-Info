require('dotenv').config();

const fs = require('fs');
const express = require('express');

const path = require('path');
const db = require('./utilities/dbProvider.js');


const PORT = process.env.PORT || 21177;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

const myTemplateEngine = require('./21177.js');

// const engine = new myTemplateEngine();

// engine.registerTemplate('myLoopTemplate', `
//     21177{for item in items}
//     <span>21177{ item.address }</span>
//     {/for}
// `);

// const engine02=new myTemplateEngine();
// engine02.registerTemplate('myConditionTemplate02',`
//     21177{if x}
//     <p>21177{ x }</p>
//     {else}
//     <p>21177{ y }</p>
//     {/if}
// `);

// let output2=engine02.render('myConditionTemplate02',{x:true,y:false});
// console.log(output2);

// let arr = [
//     { id: 10, name: 'Huy', address:'Ho Chi minh' },
//     { id: 11, name: 'An', address:'Ha Noi' }
// ];


// let output = engine.render('myLoopTemplate', { items:arr});

// console.log(output);
// Should print "<p>Item 1</p><p>Item 2</p><p>Item 3</p>"



// const homeRouter=require('./routes/home.router');

// app.use('/',homeRouter);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'html')
    ;
app.engine('html', (filePath, options, callback) => {
    fs.readFile(filePath, { encoding: 'utf-8' }, (error, content) => {
        if (error) {
            callback(error);
        }

        let engine = new myTemplateEngine();
        rendered = engine.processTemplate(content.toString(), options);
        callback(null, rendered);
    })
});

db.initDatabase();

const homeRouter = require('./routes/home.router');

app.use('/', homeRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


