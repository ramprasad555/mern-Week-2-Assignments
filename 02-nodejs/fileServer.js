/**
  You need to create an express HTTP server in Node.js which will handle the logic of a file server.
  - Use built in Node.js `fs` module

  The expected API endpoints are defined below,
  1. GET /files - Returns a list of files present in `./files/` directory
    Response: 200 OK with an array of file names in JSON format.
    Example: GET http://localhost:3000/files
 
  2. GET /file/:filename - Returns content of given file by name
     Description: Use the filename from the request path parameter to read the file from `./files/` directory
     Response: 200 OK with the file content as the response body if found, or 404 Not Found if not found. Should return `File not found` as text if file is not found
     Example: GET http://localhost:3000/file/example.txt

    - For any other route not defined in the server return 404

    Testing the server - run `npm run test-fileServer` command in terminal
 */
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;


function getnames(err, files){
  if (err) {
    throw err;
  } else{
    var Names = JSON.stringify(files);
    return Names;
    }
  }


function getallfilenames(req, res){
  var filenames = fs.readdirSync('./files/', getnames);
  res.status(200).send(filenames);
}


function readcontentsoffile(err, data){
  if(err){throw err;}
  else{
    console.log(`The content of ${data}`);
    return data;
  }

}

function getcontentsOfFile(req, res){
  var name = req.params.filename;
  var filePath = './files/' + name;
  var filenames = fs.readdirSync('./files/', getnames);

  if(filenames.includes(name)){
    var contents = fs.readFileSync(filePath,readcontentsoffile);
    res.status(200).send(contents);
  }
  else{
    res.status(404).send("File Not Found");
  }

  
}


function middleware(req, res, next){
  
  console.log("from middleware");
  res.status(404).send("invalid route")
}


app.get('/files', getallfilenames);
app.get('/file/:filename', getcontentsOfFile);
app.use(middleware)


function started(){
  console.log(`Todo Server is running on port ${port}`);
}



app.listen(port, started);






module.exports = app;
