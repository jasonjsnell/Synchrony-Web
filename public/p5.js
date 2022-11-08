//Open and connect socket
let socket = io();

  
socket.on('connect', () => {
  console.log("P5 Connected via sockets");
});

//global variables
let jasonBPM = ""
let aiBPM = ""

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  //Listen for messages named 'data' from the server
  socket.on('newBpmFromServer', (dataFromServer) => {
    console.log(dataFromServer.bpmData.bpm);
    let name = dataFromServer.bpmData.name;
    let bpm = dataFromServer.bpmData.bpm;
    if (name == "Jason") {
      jasonBPM = bpm
    } else if (name == "Ai") {
      aiBPM = bpm;
    }
    
    
  });
}

function draw() {
  background(0);
  
  //Title
  fill(222);
  textSize(50);
  text("synchrony", windowWidth/2, 100);
  
  
  //Jason's BPM
  fill(73, 202, 222);
  textFont('Courier New');
  textSize(100);
  text(jasonBPM, windowWidth/4, windowHeight/2);
  
  //AI text display here

  
  //Jason's BPM
  fill(73, 202, 222);
  textFont('Courier New');
  textSize(100);
  text(aiBPM, windowWidth/3, windowHeight/2);
  
}