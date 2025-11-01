// CORE MODULES
const readline = require('readline');
const fs = require('fs');
const http = require('http');
const url = require('url');
const events = require('events');

// USER DEFINED MODULES
const replaceHtml = require('./Modules/replaceHtml');
const user = require('./Modules/user');

/*
******* 6 - reading and writting in terminal *******
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

rl.question("Enter your name: ", (name) => {
    console.log("You entered: ", name);
    rl.close();
})
*/



/*
******* 6 Reading and writing synchronously *******
let contentRead =  fs.readFileSync("FILE/input.txt", "utf-8");
fs.writeFileSync("FILE/output.txt", contentRead);
*/

/*
******* 7 Reading and writing ansynchronously *******
fs.readFile("FILE/start.txt", "utf-8", (error, data) => {
    console.log(data);
    fs.readFile(`FILE/${data}.txt`, "utf-8", (error2, data2) => {
        console.log(data2);
        fs.readFile("FILE/append.txt", "utf-8", (error3, data3) => {
            console.log(data3);
            fs.writeFile("FILE/output.txt", `${data2}\n\n${data3}\n\nDate created: ${new Date()}`, () => {
                console.log("Content written successefully!");
            })
        })
    })
})
console.log("Reading file...")
*/


//  ******* 8 Creating a simple webserver *******

// STEP 1: CREATE A SERVER

const html = fs.readFileSync("Templates/index.html", "utf-8");
let products = JSON.parse(fs.readFileSync("Data/products.json", "utf-8"));
let productListHtml = fs.readFileSync("Templates/product-list.html", "utf-8");
let productDetailsHtml = fs.readFileSync("Templates/product-details.html", "utf-8");



// function replaceHtml(template, product)
// {
//     let output = template;

//     output = output.replace("{{%IMAGE%}}", product.productImage );
//     output = output.replace("{{%NAME%}}", product.name);
//     output = output.replace("{{%MODELNAME%}}", product.modelName);
//     output = output.replace("{{%MODELNO%}}", product.modelNumber);
//     output = output.replace("{{%SIZE%}}", product.size);
//     output = output.replace("{{%CAMERA%}}", product.Camera);
//     output = output.replace("{{%PRICE%}}", product.price);
//     output = output.replace("{{%COLOR%}}", product.color);
//     output = output.replace("{{%ID%}}", product.id);
//     output = output.replace("{{%ROM%}}", product.ROM);
//     output = output.replace("{{%DESC%}}", product.Description);
//     return (output);
// }

// const server = http.createServer((request, response) => {
//     let {query, pathname: path} = url.parse(request.url, true);
//     // let path;

//     if (path === '/' || path.toLocaleLowerCase() === '/home')
//     {
//         response.writeHead(200, {
//             "content-type": "text/html",
//             "my-header": "hello world"
//         });
//         response.end(html.replace('{{%CONTENT%}}', "You are in Home page!"));
//     }
//     else if (path.toLocaleLowerCase() === '/about')
//     {
//         response.writeHead(200, {
//             "content-type": "text/html",
//             "my-header": "hello world"
//         });
//         response.end(html.replace('{{%CONTENT%}}', "You are in About page!"));
//     }
//     else if (path.toLocaleLowerCase() === '/contact')
//     {
//         response.writeHead(200, {
//             "content-type": "text/html",
//             "my-header": "hello world"
//         });
//         response.end(html.replace('{{%CONTENT%}}', "You are in Contact page!"));
//     }
//     else if (path.toLocaleLowerCase() === '/products')
//     {
//         if (!query.id)
//         {
//             let productHtmlArray = products.map((prod) => {
//                 return replaceHtml(productListHtml, prod);
//             })
//             response.writeHead(200, {"content-type": "text/html"});
//             let productHtmlResponse = html.replace("{{%CONTENT%}}", productHtmlArray.join(''));
//             response.end(productHtmlResponse);
//         }
//         else
//         {
//             console.log("Is arriving here" + query.id);
//             let prod = products[query.id];
//             let productDetailsResponseHtml = replaceHtml(productDetailsHtml, prod);
//             response.end(html.replace("{{%CONTENT%}}", productDetailsResponseHtml));
//         }
//     }
//     else
//     {
//         response.writeHead(404, {
//             "content-type": "text/html",
//             "my-header": "hello world"
//         });
//         response.end(html.replace('{{%CONTENT%}}', "Error 404: Page not found!"));
//     }
// })

const server = http.createServer();

// STEP 2: START THE SERVER

// server.on('request', (request, response) => {
//     let {query, pathname: path} = url.parse(request.url, true);
//     // let path;

//     if (path === '/' || path.toLocaleLowerCase() === '/home')
//     {
//         response.writeHead(200, {
//             "content-type": "text/html",
//             "my-header": "hello world"
//         });
//         response.end(html.replace('{{%CONTENT%}}', "You are in Home page!"));
//     }
//     else if (path.toLocaleLowerCase() === '/about')
//     {
//         response.writeHead(200, {
//             "content-type": "text/html",
//             "my-header": "hello world"
//         });
//         response.end(html.replace('{{%CONTENT%}}', "You are in About page!"));
//     }
//     else if (path.toLocaleLowerCase() === '/contact')
//     {
//         response.writeHead(200, {
//             "content-type": "text/html",
//             "my-header": "hello world"
//         });
//         response.end(html.replace('{{%CONTENT%}}', "You are in Contact page!"));
//     }
//     else if (path.toLocaleLowerCase() === '/products')
//     {
//         if (!query.id)
//         {
//             let productHtmlArray = products.map((prod) => {
//                 return replaceHtml(productListHtml, prod);
//             })
//             response.writeHead(200, {"content-type": "text/html"});
//             let productHtmlResponse = html.replace("{{%CONTENT%}}", productHtmlArray.join(''));
//             response.end(productHtmlResponse);
//         }
//         else
//         {
//             console.log("Is arriving here" + query.id);
//             let prod = products[query.id];
//             let productDetailsResponseHtml = replaceHtml(productDetailsHtml, prod);
//             response.end(html.replace("{{%CONTENT%}}", productDetailsResponseHtml));
//         }
//     }
//     else
//     {
//         response.writeHead(404, {
//             "content-type": "text/html",
//             "my-header": "hello world"
//         });
//         response.end(html.replace('{{%CONTENT%}}', "Error 404: Page not found!"));
//     }
// })

// server.listen(8000, '127.0.0.1', () => {
//     console.log("Server started");
// })


// let myEmitter = new user();

// myEmitter.on('userRegistered', (name, id) => {
//     console.log(`User ${name} with ID ${id} Registered!`);
// })

// myEmitter.emit('userRegistered', "Tchipoco", 42);

/*LECTURE 23- UNDERSTANDING STREAN IN PRACTICE */

// SOLUTION 1: WITHOUT READABLE OR WRITEABLE STREAM
// server.on('request', (req, res) =>
// {
    // fs.readFile('./File/large-file.txt', (err, data) =>
    // {
        // if (err)
        // {
            // res.end("Something went wrong!");
            // return ;
        // }
        // res.end(data);
    // })
// })

// SOLUTION 2: USING READABLE OR WRITEABLE STREAM
// server.on('request', (req, res) => {
//     let rs = fs.createReadStream('./File/large-file.txt');

//     rs.on('data', (chunk) => {
//         res.write(chunk);
//     })
//     rs.on('end', () => {
//         res.end();
//     })
//     rs.on('error', (err) => {
//         res.end(err.message);
//     })
// })

/*LECTURE 23- UNDERSTANDING PIPE METHOD */
// SOLUTION 3: USING PIPE METHOD
// server.on('request', (req, res) => {
//     let rs = fs.createReadStream('./File/large-file.txt');
//     rs.pipe(res);
// })

/*LECTURE 29- EVENT LOOP */

console.log('Program has started');


// STORED IN - 2ST PHASE
fs.readFile("./File/input.txt", () => {
    console.log('File read complete')
    
    // STORED IN - 1ST PHASE
    setTimeout(() => {
        console.log('Timer callback executed');
    })

    // STORED IN - 3ST PHASE
    setImmediate(() => {console.log('setImmediate callback executed')})
    process.nextTick(() => {console.log('process.nextTick callback executed ')})
})


console.log('Program has completed');