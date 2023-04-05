// const http = require('http')
// const name = require("./features")
import http from 'http'
import fs from 'fs'
// import name from './features.js'
//  import {name2,name3} from './features.js'
// console.log(name,name2,name3)
import * as myObj from './features.js'
// console.log(myObj.name3)
import {findLove} from './features.js'

const home = fs.readFileSync('./index.html',()=>{})

const server = http.createServer((req,res)=>{
 
    if(req.url === "/about"){
        res.end("<h1>My name is tushar<h1>")
    }
    else if(req.url === "/contact") {
        res.end("<h1>Contact at wervbnm@gmail.com<h1>");
    }
    else if(req.url === "/"){
// const home = fs.readFile('./index.html',(err,home)=>{res.end(home)})
    res.end(home)

        // res.end(`<h1>Love Percentage is ${findLove()}%</h1>`)
    }
    else{
        res.end("Page no found");
    }
})
const hostname = '127.0.0.1';
const port = 3000
server.listen(port, hostname,()=>{
    console.log(`Server Started succesfully at http://${hostname}:${port}/`);
})