window.addEventListener('load', () => {
    
    console.log('Window loaded');

    let bpmHistory = document.getElementById('bpm-history');

    //fetch all messages from server
    fetch('/bpm-history')
    .then(response => response.json())
    .then(data => {
        
        //get messages from data, and var name inside is data
        let bpmHistory = data.data;

        //loop through each message individually
        for (let i = 0; i < bpmHistory.length; i++){
            
            let message = bpmHistory[i].message;
            let time = bpmHistory[i].time;

            let newMessage = document.createElement('p');
            let newMessageContent = `${time}: ${message}`;
            newMessage.innerHTML = newMessageContent;
            bpmHistory.appendChild(newMessage);
        }
    })
    .catch(error => {
        console.log(error);
    })

    //input field and submit button
    let bpmInputField = document.getElementById('bpm-input');
    let bpmSubmitBtn = document.getElementById('bpm-submit');
    
    //listen to the click
    bpmSubmitBtn.addEventListener('click', () => {
        
        let bpmValue = bpmInputField.value;
        console.log(bpmValue);

        //create post request
        let bpmObj = {
            bpm: bpmValue
        };
        //stringify
        let bpmObjJSON = JSON.stringify(bpmObj);

        //send the new user data from input field to server via fetch func
        fetch('/new-bpm', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: bpmObjJSON
        })
        .then(response => response.json())
        .then(data => {
            
            //extract vars from data obt
            let bpm = data.content.bpm;
            let time = data.content.time;

            let newBpm = document.createElement('p');
            let newBpmContent = `${time}: ${bpm}`;
            newBpm.innerHTML = newBpmContent;
            bpmHistory.insertBefore(newBpm, bpmHistory.firstChild);
        })
        .catch(error => {
            console.log(error);
        });
    });
    

})