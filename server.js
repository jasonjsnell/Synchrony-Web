//Synchrony
//setup
let express = require('express');
let app = express();
app.use('/', express.static('public'));

//create http server (needed for socket)
let server = require('http').createServer(app);

//database
let DataStore = require("nedb");
let db = new DataStore("bpms.db");
db.loadDatabase();

//removal code
// db.remove({}, { multi: true }, function (err, numRemoved) {
//   console.log("DB reset: num removed:", numRemoved);
// });


//socket
const { Server } = require('socket.io');
const io = new Server(server);

//enviroment port or 3000 port
let port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log("Server is listening at localhost:", + port);
});

//--> SOCKETS
io.sockets.on('connection', (socket) => {
    console.log("Server socket: connected");
  
 
  socket.on('disconnect', (data) => {
    console.log("Server socket: disconnected");
  });
  

  socket.on('newBpmFromWatch', (dataFromWatch) => {
    
    //user
    //bpm
    //time
    console.log("New BPM from watch", dataFromWatch);
  
    //replicate data object for DB insertion
    let dataFromWatchForDb = dataFromWatch;
    
    //add timestamp to db storage obj 
    dataFromWatchForDb.time = Date();

    //save it to the database
    db.insert(dataFromWatchForDb, (err, newDocs) => {
      if (err) {
        console.log("DB error");
      } else {
        console.log("DB success");
      }
    });
    
    //send to others, and not self
    socket.broadcast.emit('newBpmFromServer', {bpmData: dataFromWatch});
    
  });
  
  
});

//--> ROUTES
//Accessor to BPM history, called by HTML page
app.get("/bpm-history", (request, response) => {
  //get data from DB
  db.find({}, (err, dbBpms) => {
    if (err) {
      response.json({ task: "task failed" });
    } else {
      //create data obj from array
      let bpmsJsonDataObj = {
        bpms: dbBpms,
      };
      //pass data as JSON
      response.json(bpmsJsonDataObj);
    }
  });
});

//Version 2 
//Setter: new BPM updates from watch
// app.post("/new-bpm", (request, response) => {
  
//   //retrieve data obj
//   let dataFromWatch = request.body;
  
//   console.log("data from watch", dataFromWatch);

//   //add timestamp to it
//   dataFromWatch.time = Date();

//   let dataObj = {
//     content: dataFromWatch,
//   };

//   //save it to the database
//   db.insert(dataFromWatch, (err, newDocs) => {
//     if (err) {
//       response.json({ task: "DB Error" });
//     } else {
//       response.json({ task: "DB Success" });
//     }
//   });
// });