//Server
let express = require("express");
let server = express();

server.use("/", express.static("public")); //set home folder to find client side files
server.use(express.json()); //let express know we are using JSON data

//database
let DataStore = require("nedb");
let db = new DataStore("bpms.db");
db.loadDatabase();

//Routes
server.get("/bpm-history", (request, response) => {
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

//RECEIVE NEW BPM UPDATES FROM WATCH
server.post("/new-bpm", (request, response) => {
  

  //retrieve data obj
  let dataFromWatch = request.body;
  
  console.log("data from watch", dataFromWatch);

  //add timestamp to it
  dataFromWatch.time = Date();

  let dataObj = {
    content: dataFromWatch,
  };

  //save it to the database
  db.insert(dataFromWatch, (err, newDocs) => {
    if (err) {
      response.json({ task: "DB Error" });
    } else {
      response.json({ task: "DB Success" });
      //response.json(dataObj);
    }
  });
});

let port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on localhost:${port}`);
});
