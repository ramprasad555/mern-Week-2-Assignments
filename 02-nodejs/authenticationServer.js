/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express")
const port = 3000;
const bodyParser = require('body-parser');
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

/*
var dict = {
  username: ,
  password : ,
  firstname: ,
  lastname:

}
*/
var usersdata = [];

function finduser(username){
  for(var i = 0; i< usersdata.length; i++){
    if (usersdata[i].username == username){
      return i;
    }
  }
  //not found
  return "X";
}

function signup(req,res){
  var given_user_data = req.body;
  var index_ = finduser(given_user_data.username);
  if( index_ != "X"){
    console.log("User already exists");
    res.status(400).send({message:"Username Already Exists"});
  }
  else{
    let id_ = Math.floor((Math.random() * 987654));
    var dict = {
      id : id_,
      username: given_user_data.username,
      password : given_user_data.password,
      firstname: given_user_data.firstname,
      lastname: given_user_data.lastname

    };
    usersdata.push(dict);
    console.log(usersdata);
    res.status(200).send("created successfully");
  }
  
}


function authenticate(username, password){
  var index_ = finduser(username);
  if (index_ == "X"){
    return [0,-1];
  }
  else{
    if(usersdata[index_].username == username && usersdata[index_].password == password){
      //res.status(200).send(usersdata[index_]);
      return [1,index_];
    }
    else{
      console.log("invalid credentials");
      // res.status(401).send("unauthorised");
      return [-1,-1];
    }
  }
}

function login(req, res){
  var user = req.body.username;
  var pass = req.body.password;  
  var result = authenticate(user, pass);
  if(result[1] == -1 && result[1] == -1){
    res.status(403).send('Invalid Credentials');
  } 
  else if (result[0] == 1 && result[1] == -1){ 
    res.status(403)
  }
  else{
    res.status(200).send(usersdata[result[1]]);
  }
}

function getalldata(req,res){
  var user = req.headers.username;
  var pass = req.headers.password;
  var result = authenticate(user, pass);
  if(result[0] == 1){
    var users =[];
    for(var i =0;i < usersdata.length; i++){
      let userone = [];
      userone.push(usersdata[i].username);
      userone.push(usersdata[i].id);
      users.push(userone);
    }
    res.status(200).send({"users": users});
  }
  else{
    res.status(401).send("unauthorised");
  }
}



function middleware(req, res, next){
  console.log("from middleware");
  res.status(404).send("invalid route")
}


app.use(bodyParser.json());
app.post('/signup', signup); //working
app.post('/login',login); //working
app.get('/data',getalldata); //working

app.use(middleware);
function started(){
  console.log(`authentication Server is running on port ${port}`);
}

app.listen(port, started);
module.exports = app;
