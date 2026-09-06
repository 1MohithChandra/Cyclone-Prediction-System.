// ----------------------------------------
// PAGE LOAD ANIMATION
// ----------------------------------------

gsap.from(".fade-in", {
    y: 15,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "power2.out"
});


// ----------------------------------------
// BACKEND API URL
// ----------------------------------------

const API_URL =
    "https://cyclone-prediction-system-backend.vercel.app";


// ----------------------------------------
// PREDICTION FORM
// ----------------------------------------

document
    .getElementById("prediction-form")
    .addEventListener("submit", async (event) => {


        // Prevent page reload

        event.preventDefault();


        // Get submit button

        const submitButton =
            document.getElementById(
                "submit-btn"
            );


        // Change button text

        submitButton.textContent =
            "Processing...";


        // Disable button

        submitButton.disabled =
            true;


        // ----------------------------------------
        // CREATE REQUEST DATA
        // ----------------------------------------

        const payload = {


            Sea_Surface_Temperature:

                parseFloat(
                    document
                        .getElementById("sst")
                        .value
                ),


            Atmospheric_Pressure:

                parseFloat(
                    document
                        .getElementById("pressure")
                        .value
                ),


            Humidity:

                parseFloat(
                    document
                        .getElementById("humidity")
                        .value
                ),


            Wind_Shear:

                parseFloat(
                    document
                        .getElementById("shear")
                        .value
                ),


            Vorticity:

                parseFloat(
                    document
                        .getElementById("vorticity")
                        .value
                ),


            Latitude:

                parseFloat(
                    document
                        .getElementById("lat")
                        .value
                ),


            Ocean_Depth:

                parseFloat(
                    document
                        .getElementById("depth")
                        .value
                ),


            Proximity_to_Coastline:

                parseFloat(
                    document
                        .getElementById("coast")
                        .value
                ),


            Pre_existing_Disturbance:

                parseInt(
                    document
                        .getElementById(
                            "disturbance"
                        )
                        .value
                )

        };


        try {


            // ----------------------------------------
            // SEND DATA TO BACKEND
            // ----------------------------------------

            const response =
                await fetch(

                    `${API_URL}/predict`,

                    {

                        method:
                            "POST",


                        headers: {

                            "Content-Type":
                                "application/json"

                        },


                        body:

                            JSON.stringify(
                                payload
                            )

                    }

                );


            // ----------------------------------------
            // CHECK RESPONSE
            // ----------------------------------------

            if (!response.ok) {


                const errorMessage =
                    await response.text();


                throw new Error(

                    `Backend Error: ${response.status}

${errorMessage}`

                );

            }


            // ----------------------------------------
            // GET BACKEND RESPONSE
            // ----------------------------------------

            const data =
                await response.json();


            // ----------------------------------------
            // DISPLAY RESULTS
            // ----------------------------------------

            displayResults(
                data
            );


        } catch (error) {


            console.error(
                "Backend connection error:",
                error
            );


            alert(

                "Unable to connect to the backend.\n\n" +

                "Please check that the FastAPI backend is running " +

                "and that the deployed backend URL is correct."

            );


        } finally {


            // Restore button

            submitButton.textContent =
                "Run Prediction Model";


            submitButton.disabled =
                false;

        }


    });


// ----------------------------------------
// DISPLAY RESULTS FUNCTION
// ----------------------------------------

function displayResults(data) {


    const resultCard =
        document.getElementById(
            "result-card"
        );


    // ----------------------------------------
    // SHOW RESULT CARD
    // ----------------------------------------

    resultCard.classList.remove(
        "hidden"
    );


    // ----------------------------------------
    // DISPLAY PREDICTION
    // ----------------------------------------

    document
        .getElementById(
            "result-title"
        )
        .textContent =
            data.prediction;


    // ----------------------------------------
    // DISPLAY CLASSIFICATION
    // ----------------------------------------

    document
        .getElementById(
            "result-classification"
        )
        .textContent =
            data.classification;


    // ----------------------------------------
    // DISPLAY CYCLONE PROBABILITY
    // ----------------------------------------

    document
        .getElementById(
            "prob-yes"
        )
        .textContent =

            Number(
                data.cyclone_probability
            ).toFixed(2)

            + "%";


    // ----------------------------------------
    // DISPLAY NO CYCLONE PROBABILITY
    // ----------------------------------------

    document
        .getElementById(
            "prob-no"
        )
        .textContent =

            Number(
                data.no_cyclone_probability
            ).toFixed(2)

            + "%";


    // ----------------------------------------
    // FEATURE IMPORTANCE LIST
    // ----------------------------------------

    const featureList =
        document.getElementById(
            "top-features"
        );


    // Clear previous features

    featureList.innerHTML =
        "";


    // ----------------------------------------
    // ADD NEW FEATURES
    // ----------------------------------------

    data
        .top_important_features
        .forEach(
            (feature) => {


                const listItem =
                    document.createElement(
                        "li"
                    );


                // Convert underscores to spaces

                const featureName =
                    feature
                        .feature
                        .replace(
                            /_/g,
                            " "
                        );


                listItem.textContent =

                    `${featureName} ` +

                    `(${feature.importance}% impact)`;


                featureList.appendChild(
                    listItem
                );


            }
        );


    // ----------------------------------------
    // ANIMATE RESULT CARD
    // ----------------------------------------

    gsap.fromTo(

        resultCard,


        {

            y: 20,

            opacity: 0

        },


        {

            y: 0,

            opacity: 1,

            duration: 0.5,

            ease: "power2.out"

        }

    );


    // ----------------------------------------
    // SCROLL TO RESULTS
    // ----------------------------------------

    resultCard.scrollIntoView({

        behavior:
            "smooth",

        block:
            "start"

    });


}


// ----------------------------------------
// RESET BUTTON
// ----------------------------------------

document
    .getElementById("reset-btn")
    .addEventListener(
        "click",
        () => {


            // Clear SST

            document
                .getElementById(
                    "sst"
                )
                .value =
                    "";


            // Clear Pressure

            document
                .getElementById(
                    "pressure"
                )
                .value =
                    "";


            // Clear Humidity

            document
                .getElementById(
                    "humidity"
                )
                .value =
                    "";


            // Clear Wind Shear

            document
                .getElementById(
                    "shear"
                )
                .value =
                    "";


            // Clear Vorticity

            document
                .getElementById(
                    "vorticity"
                )
                .value =
                    "";


            // Clear Latitude

            document
                .getElementById(
                    "lat"
                )
                .value =
                    "";


            // Clear Ocean Depth

            document
                .getElementById(
                    "depth"
                )
                .value =
                    "";


            // Clear Coast Proximity

            document
                .getElementById(
                    "coast"
                )
                .value =
                    "";


            // Reset disturbance dropdown

            document
                .getElementById(
                    "disturbance"
                )
                .selectedIndex =
                    0;


            // Hide results

            document
                .getElementById(
                    "result-card"
                )
                .classList.add(
                    "hidden"
                );


        }
    );