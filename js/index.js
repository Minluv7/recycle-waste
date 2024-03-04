// More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

    // the link to your model provided by Teachable Machine export panel
    const URL = "https://teachablemachine.withgoogle.com/models/1PXklZ2Q1/";

    let model, webcam, labelContainer, maxPredictions;
    let isRunning = false;
    // Load the image model and setup the webcam
    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }
    }

    async function loop() {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    }

    // run the webcam image through the image model
   // run the webcam image through the image model
async function predict() {
    // predict kan een image, video of canvas html element accepteren
    const prediction = await model.predict(webcam.canvas);

    // Zoek het hoogste waarschijnlijkheidsresultaat
    let highestProbability = 0;
    let predictedClass = "";

    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability > highestProbability) {
            highestProbability = prediction[i].probability;
            predictedClass = prediction[i].className;
        }
    }

    // Toon alleen het hoogste waarschijnlijkheidsresultaat
    labelContainer.innerHTML = `Resultaat: ${predictedClass} (${(highestProbability * 100).toFixed(2)}%)`;
}





// Stop de webcam en het model
function stop() {
    // Stop de lus voor het voorspellen en stop de webcam
    isRunning = false;
    webcam.stop();
}
