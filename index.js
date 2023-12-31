window.onload = function() {

    console.log('loaded');

    // declare basic variables
    const record = document.querySelector('.record');
    const stopit = document.querySelector('.stop');
    let audioCtx;

    let recording = false;

    visualizeRecording();

    function visualizeRecording() {

        // check if media can be captured from mic
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            console.log("getUserMedia supported.");

            const constraints = { audio: true };
            let chunks = [];

            // define success callback
            let onSuccess = function(stream) {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.stop();
                
                // event listener for play button
                record.onclick = function() {
                    // start media recorder and record 10 ms chunks of sound
                    mediaRecorder.start(10);
                    recording = true;

                    console.log('recorder state:', mediaRecorder.state);
                    console.log("recorder started");

                    // update play button to be red
                    record.style.background = "red";

                    // const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
                    // const audioRecordURL = window.URL.createObjectURL(blob);
                    // audio.src = audioRecordURL;
                    // mediaRecorder.ondataavailable = (e) => {
                        
                    //     // visualize 

                    // }
                    visualize(stream);
                }

                // stop button event listener
                stopit.onclick = function() {
                    mediaRecorder.stop();
                    recording = false;
                    console.log(mediaRecorder.state, recording);
                    console.log("recorder stopped");
                    record.style.background = "";
                }

                mediaRecorder.onstop = function(e) {
                    console.log("data available after MediaRecorder.stop() called.");
                }
            }

            // error callback
            let onError = function(err) {
                console.log('The following error occured: ' + err);
            }
            
            // final function calling the callbacks
            navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
        } else {
            console.log("getUserMedia not supported on your browser!");
        }

        function visualize(stream) {
            // create audio context
            if(!audioCtx) {
                audioCtx = new AudioContext();
            }

            console.log('in visualize stream,', recording );

            // create 2d canvas
            const ctx = canvas.getContext("2d");

            const source = audioCtx.createMediaStreamSource(stream);

            // create analyzer and define size of buffer array
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            console.log('buffer length', bufferLength);

            source.connect(analyser);
            // note: the source is not connected to destination to prevent audio playback
            // analyser.connect(audioCtx.destination);

            const WIDTH = canvas.width;
            const HEIGHT = canvas.height;

            let barWidth = (WIDTH / bufferLength);
            let barHeight;
            let x = 0;

            ctx.clearRect(0, 0, WIDTH, HEIGHT);

            function renderFrame() {
                // check if user pressed the start button, if not, stop visualizer
                if (recording === true) {
                    // the below function will loop the renderFrame() function once it started
                    requestAnimationFrame(renderFrame);
                } else {
                    console.log('in visualize stream, recording:', recording );
                    // ctx.clearRect(0, 0, WIDTH, HEIGHT);
                    return;
                }
            
                x = 0;
            
                analyser.getByteFrequencyData(dataArray);
            
                // fill canvas with black color
                ctx.fillStyle = "#000";
                ctx.fillRect(0, 0, WIDTH, HEIGHT);

            
                for (let i = 0; i < bufferLength; i++) {
                    barHeight = dataArray[i];
                    
                    let r = barHeight + (30 * (i/bufferLength));
                    let g = 255 * (i/bufferLength);
                    let b = Math.pow(0.03 * x, 3);
            
                    // ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                    // ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

                    // ctx.fillStyle = `rgb(${255-barHeight}, ${255-barHeight}, 0)`;

                    // this gives a light blue color
                    // ctx.fillStyle = `rgb(${barHeight}, ${barHeight + 100}, ${barHeight + 100})`;

                    // ctx.fillStyle = `rgb(${(barHeight + x*30)/5228+100}, ${(barHeight + x*30)/5228+150}, ${(barHeight + x*30)/5228+255})`;

                    // ctx.fillStyle = `rgb(${255/x*50}, ${255/(-x^2 + 64)*50}, ${(x-20)/128*255})`;

                    // ctx.fillStyle = `rgb(${255*(128/x)/128}, ${100/(0.1*(x-64)*(x-64))}, ${(x^2)/128*255 - 10})`;

                    // ctx.fillStyle = `rgb(${255*(128/x)/128}, ${100/(0.1*(x-64)*(x-64))}, ${Math.pow(0.05 * x, 3)})`;

                    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                    ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
            
                    x += barWidth + 1;
                }
            }
            renderFrame();  
        }
    }
};