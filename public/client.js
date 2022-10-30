window.addEventListener('load', () => {
    
    console.log('Window loaded');

    let bpmHistoryDiv = document.getElementById('bpm-history');

    //RETRIEVING DATA FROM THE DATABASE
    //fetch all messages from server
    fetch('/bpm-history')
    .then(response => response.json())
    .then(data => {
        
        //get messages from data, and var name inside is data
        let bpmHistoryFromDb = data.bpms;
      
      //sort by date, most recent first
        bpmHistoryFromDb.sort(sortByDate);
      
      //only list the most recent 100 entries so the HTML page doesn't explode
      let maxDisplay = bpmHistoryFromDb.length;
      if (maxDisplay > 100) {
        maxDisplay = 100;
      }
      
        //loop through each message individually
        for (let i = 0; i < maxDisplay; i++){
            
            let bpmFromDb = bpmHistoryFromDb[i];
            let bpm = bpmFromDb.bpm;
            let time = bpmFromDb.time;
            let user = bpmFromDb.user;

          //if all the vars are valid...
            if (user && bpm && time) {
              
              //print on screen
              let newBpmDisplay = document.createElement('p');
              let newBpmContent = `${bpm} BPM from User ${user} at ${time} : `;
              newBpmDisplay.innerHTML = newBpmContent;
              bpmHistoryDiv.appendChild(newBpmDisplay);
            }
            
        }
    })
    .catch(error => {
        console.log(error);
    })

})

//sorts JSON ojbect array by date
function sortByDate(a, b) {
    return new Date(b.time).getTime() - new Date(a.time).getTime();
}