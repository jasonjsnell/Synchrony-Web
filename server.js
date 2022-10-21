//Server
let express = require('express');
let server = express();

server.use('/', express.static('public')); //set home folder to find client side files
server.use(express.json()); //let express know we are using JSON data

//database
let DataStore = require('nedb');
let db = new DataStore('messages.db');
db.loadDatabase();

//Routes
server.get('/bpm-history', (request, response) => {

  //get data from DB
  db.find({}, (err, docs) => {
    if (err) {
      response.json({ task: "task failed" });
    } else {
      //create data obj from array
      let messageData = {
        data: docs
      }
      //pass data as JSON
      response.json(messageData);
    }
  })
});

//post request from web page input field
server.post('/new-bpm', (request, response) => {

  //retrieve data obj
  let dataFromClient = request.body;
  //add timestamp to it
  dataFromClient.time = Date();

  let dataObj = {
    content: dataFromClient
  }

  //save it to the database
  db.insert(dataFromClient, (err, newDocs) => {
    if (err) {
      response.json({ task: "DB insertt failed" });
    } else {
      response.json(dataObj);
    }
  });
});

let port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on localhost:${port}`)
})