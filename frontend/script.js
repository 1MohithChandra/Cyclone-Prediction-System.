// ==========================================
// PAGE LOAD ANIMATION
// ==========================================

gsap.from(".fade-in", {
    y: 15,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "power2.out"
});


// ==========================================
// FORM SUBMISSION
// ==========================================

document
    .getElementById("prediction-form")
    .addEventListener("submit", async function (e) {

        // Prevent page refresh
        e.preventDefault();


        const btn =
            document.getElementById("submit-btn");


        // Change button text
        btn.textContent = "Processing...";


        // Disable button while processing
        btn.disabled = true;


        // ==========================================
        // CREATE PAYLOAD FOR BACKEND
        // ==========================================

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
                        .getElementById("disturbance")
                        .value
                )

        };


        try {

            // ==========================================
            // CALL FASTAPI BACKEND
            // ==========================================

            const response =
                await fetch(
                    "http://127.0.0.1:8000/predict",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(payload)
                    }
                );


            // Check for backend error
            if (!response.ok) {

                throw new Error(
                    "Backend connection failed"
                );

            }


            // Get backend response
            const data =
                await response.json();


            // Display prediction
            displayResults(data);

        }


        catch (error) {

            console.error(
                "Prediction error:",
                error
            );


            alert(
                "Unable to connect to the backend.\n\n" +
                "Please make sure the FastAPI server is running."
            );

        }


        finally {

            // Restore button
            btn.textContent =
                "Run Prediction Model";

            btn.disabled =
                false;

        }

    });




// ==========================================
// DISPLAY RESULTS
// ==========================================

function displayResults(data) {


    const resultCard =
        document.getElementById(
            "result-card"
        );


    // Show result card
    resultCard.classList.remove(
        "hidden"
    );


    // ==========================================
    // PREDICTION TITLE
    // ==========================================

    document
        .getElementById(
            "result-title"
        )
        .textContent =
            data.prediction;


    // ==========================================
    // CLASSIFICATION
    // ==========================================

    document
        .getElementById(
            "result-classification"
        )
        .textContent =
            data.classification;


    // ==========================================
    // CYCLONE PROBABILITY
    // ==========================================

    document
        .getElementById(
            "prob-yes"
        )
        .textContent =
            Number(
                data.cyclone_probability
            ).toFixed(2)
            + "%";


    // ==========================================
    // NO CYCLONE PROBABILITY
    // ==========================================

    document
        .getElementById(
            "prob-no"
        )
        .textContent =
            Number(
                data.no_cyclone_probability
            ).toFixed(2)
            + "%";


    // ==========================================
    // FEATURE IMPORTANCE
    // ==========================================

    const featureList =
        document.getElementById(
            "top-features"
        );


    // Clear previous features
    featureList.innerHTML = "";


    // Add features
    if (
        data.top_important_features &&
        Array.isArray(
            data.top_important_features
        )
    ) {

        data
            .top_important_features
            .forEach(
                function (feature) {


                    const li =
                        document.createElement(
                            "li"
                        );


                    const readableName =
                        feature.feature.replace(
                            /_/g,
                            " "
                        );


                    li.textContent =
                        readableName +
                        " (" +
                        Number(
                            feature.importance
                        ).toFixed(2) +
                        "% impact)";


                    featureList.appendChild(
                        li
                    );

                }
            );

    }


    // ==========================================
    // RESULT ANIMATION
    // ==========================================

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


    // Scroll to result
    setTimeout(
        function () {

            resultCard.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        },
        200
    );

}




// ==========================================
// RESET BUTTON
// ==========================================

document
    .getElementById("reset-btn")
    .addEventListener(
        "click",
        function () {


            // ==========================================
            // CLEAR ALL INPUT FIELDS
            // ==========================================

            document
                .querySelectorAll(
                    "#prediction-form input"
                )
                .forEach(
                    function (input) {

                        input.value = "";

                    }
                );


            // ==========================================
            // RESET DISTURBANCE DROPDOWN
            // ==========================================

            document
                .getElementById(
                    "disturbance"
                )
                .value =
                    "1";


            // ==========================================
            // HIDE RESULT CARD
            // ==========================================

            const resultCard =
                document.getElementById(
                    "result-card"
                );


            resultCard.classList.add(
                "hidden"
            );


            // ==========================================
            // CLEAR RESULT CONTENT
            // ==========================================

            document
                .getElementById(
                    "result-title"
                )
                .textContent =
                    "";


            document
                .getElementById(
                    "result-classification"
                )
                .textContent =
                    "";


            document
                .getElementById(
                    "prob-yes"
                )
                .textContent =
                    "";


            document
                .getElementById(
                    "prob-no"
                )
                .textContent =
                    "";


            document
                .getElementById(
                    "top-features"
                )
                .innerHTML =
                    "";


            // Focus first field
            document
                .getElementById(
                    "sst"
                )
                .focus();

        }
    );