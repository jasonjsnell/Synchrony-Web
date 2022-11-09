//Open and connect socket
let socket = io();

let aiLast24Hours = [];
let jasonLast24Hours = [];


let jasonBPM = "0"
let aiBPM = "0"

function setup() {
  
  //create P5 canvas
  createCanvas(windowWidth, windowHeight);
  
  frameRate(1);
  
  //asking the server JS for the BPM history
  fetch('/bpm-history')
    .then(response => response.json())
    .then(data => {
      
      //get messages from data, and var name inside is data
      let bpmHistoryFromDb = data.bpms;
      
      //sort by date, most recent first
      bpmHistoryFromDb.sort(sortByDate);
    
      let mostRecentEntryDate = new Date(bpmHistoryFromDb[0].time);
      console.log("mostRecentEntryDate", mostRecentEntryDate)
    
      for (var i = 0; i < bpmHistoryFromDb.length; i++){

        //grab the entry from db
        let dbEntry = bpmHistoryFromDb[i];
        let dbEntryName = dbEntry.user;
        
        //grab the time variable
        let dbEntryDate = new Date(dbEntry.time);
        
        //milliseconds between two Dates
        let timeDiff = mostRecentEntryDate.getTime() - dbEntryDate.getTime();
        
        //divide by 1000 to get seconds
        let timeDiffSeconds = timeDiff/1000;
        
        let timeDiffMinutes = timeDiffSeconds / 60;
        
        let timeDiffHours = timeDiffMinutes / 60;
        
        //if entry is within last X hours
        if (timeDiffHours < 24) {
          
          //if name is Ai
          if (dbEntryName == "Ai"){
            
            aiLast24Hours.push(dbEntry); //add to AI array
          
          } else if (dbEntryName == "Jason"){
            
            //else if name is Jason
            jasonLast24Hours.push(dbEntry);//add to Jason array
          }
        
        } else {
          console.log("DB search for last 24 hours is complete");
          break;
        }
      }
    
      console.log("number of entries in database", bpmHistoryFromDb.length);
      console.log("number of entries for Jason, last 24 hours", jasonLast24Hours.length);
      console.log("number of entries for Ai, last 24 hours", aiLast24Hours.length);

    })
    .catch(error => {
      console.log(error);
    })
  
  socket.on('connect', () => {
    
    console.log("P5 Connected via sockets");
    
    //Listen for messages named 'data' from the server
    socket.on('newBpmFromServer', (dataFromServer) => {


      let name = dataFromServer.bpmData.user;
      let bpm = dataFromServer.bpmData.bpm;
     
      if (name == "Jason") {
       
        jasonBPM = bpm;

      } else if (name == "Ai") {
        
        aiBPM = bpm;
        
      }
     
    });
    
  });
  
}



function draw() {
  
  //console.log(bpmHistoryFromDb[0]);
  let aiColor = color(230, 78, 78);
  let jasonColor = color(73, 202, 222);
  
  background(0);
  
  //Title
  textAlign(CENTER);
  fill(222);
  textSize(50);
  textFont('Courier New');
  text("synchrony", (windowWidth/2), windowHeight * 0.125);
  
  
  //Jason's BPM
  fill(jasonColor);
  textSize(50);
  text(jasonBPM, windowWidth * 0.25, windowHeight * 0.35);
  
  //Jason name
  textSize(20);
  text("Jason", windowWidth * 0.25, windowHeight * 0.50);
  
  //jason's line
  chart(jasonLast24Hours, jasonColor);
  
  //AI BPM
  fill(aiColor);
  textSize(50);
  text(aiBPM, windowWidth * 0.75, windowHeight * 0.35);
  
  //AI name
  textSize(20);
  text("Ai", windowWidth * 0.75, windowHeight * 0.50);
  
  //ai's line
  chart(aiLast24Hours, aiColor);
}

function chart(data, lineColor) {
  
  //level of zoom in on data
  let xZoom = 5.0
  
  //how far down the screen the line is rendered
  let yShift = windowHeight * 0.5;
  
  //far right side of screen will be now
  let startTime = new Date().getTime();
  
  //if arrays have data
  if (data.length > 0) {
    
    //first bpm is first item in list
    let prevBpm = Number(data[0].bpm);
    
    //start x position on right side of screen and build to left
    let prevX = windowWidth;
    
    //loop through each data point
    for (var i = 0; i < data.length; i++){

      //get time from data obj
      let currTime = new Date(data[i].time).getTime();
      //calc diff from last data obj
      let timeDiff = startTime-currTime
      
      //calc x by starting with right side, subtract nanoseconds and x zoom
      let currX = (windowWidth - (timeDiff / 10000)) * xZoom;
    
      //grab BPM
      let currBpm = Number(data[i].bpm);

      //line traits
      strokeWeight(1);
      stroke(lineColor);
      line(prevX, prevBpm + yShift, currX, currBpm + yShift);

      //update vars for next round
      prevBpm = currBpm;
      prevX = currX;

    }
  }
}

//HELPER SUBS
//sorts JSON ojbect array by date
function sortByDate(a, b) {
  return new Date(b.time).getTime() - new Date(a.time).getTime();
}