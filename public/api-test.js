window.addEventListener('load', () => {
    
    console.log('API test window loaded');
    
     //input field and submit button
     let submitBtn = document.getElementById('test-btn');
     let testDiv = document.getElementById('test-output');
     
     //listen to the click
     submitBtn.addEventListener('click', () => {
        //receiveFromLocalUserNewBpm(60);
        sendToLocalUserNewBpm(75);

     });
});

//sending data from the website to the iOS app
function sendToLocalUserNewBpm(newBpm) {

    let testDiv = document.getElementById('test-output');
    
    //try sending data to the iOS app
    try {

        let dataToSendToIOSApp = {
            bpm: newBpm //<-- the bpm value is passed to the iOS app app
        }
        //webkit is available as an object when this page is loaded in an iOS app WebView
        //sendToLocalUserNewBpm is the name of the function that is in the iOS app app
        webkit.messageHandlers.sendToLocalUserNewBpm.postMessage(dataToSendToIOSApp);
        
        //show success message on HTML page
        testDiv.innerHTML = newBpm + " BPM sent from HTML WebView to iOS app";
            
    } catch(err) {

        //show error on HTML page if function call to iOS app doesn't work
        testDiv.innerHTML = err;

    }
}

//website receives data from the apple watch --> iOS app
function receiveFromLocalUserNewBpm(bpm) {

    let testDiv = document.getElementById('test-output');
    testDiv.innerHTML = "New BPM from iOS app " + bpm;
    return bpm;

}

