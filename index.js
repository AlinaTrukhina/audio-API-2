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

                let onSuccess = function(stream) {
                    const mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.stop();

                    record.onclick = function() {
                        mediaRecorder.start(10);
                        recording = true;

                        console.log('recorder state:', mediaRecorder.state);
                        console.log("recorder started");
                        record.style.background = "red";

                        // const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
                        // const audioRecordURL = window.URL.createObjectURL(blob);
                        // audio.src = audioRecordURL;
                        // mediaRecorder.ondataavailable = (e) => {
                            
                        //     // visualize 

                        // }
                        visualize(stream);
                    }

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

                let onError = function(err) {
                    console.log('The following error occured: ' + err);
                }
                
                navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
            } else {
                console.log("getUserMedia not supported on your browser!");
            }

            function visualize(stream) {
                if(!audioCtx) {
                    audioCtx = new AudioContext();
                }

                console.log('in visualize stream,', recording );

                var ctx = canvas.getContext("2d");

                const source = audioCtx.createMediaStreamSource(stream);

                const analyser = audioCtx.createAnalyser();
                analyser.fftSize = 256;
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                source.connect(analyser);
                // analyser.connect(audioCtx.destination);

                const WIDTH = canvas.width;
                const HEIGHT = canvas.height;

                let barWidth = (WIDTH / bufferLength) * 2.5;
                let barHeight;
                let x = 0;

                function renderFrame() {
                    if (recording === true) {
                        requestAnimationFrame(renderFrame);
                    } else {
                        console.log('in visualize stream,', recording );
                        return;
                    }
                
                    x = 0;
                
                    analyser.getByteFrequencyData(dataArray);
                
                    ctx.fillStyle = "#000";
                    ctx.fillRect(0, 0, WIDTH, HEIGHT);
                
                        for (var i = 0; i < bufferLength; i++) {
                            barHeight = dataArray[i];
                            
                            var r = barHeight + (25 * (i/bufferLength));
                            var g = 250 * (i/bufferLength);
                            var b = 50;
                    
                            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
                    
                            x += barWidth + 1;
                        }
                    }
                    renderFrame();  
            }
        }
};