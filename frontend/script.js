// =========================================
// API URL
// =========================================

const API_URL =
    "http://127.0.0.1:8000/predict";



// =========================================
// GET ELEMENTS
// =========================================

const predictionForm =
    document.getElementById(
        "predictionForm"
    );


const resultSection =
    document.getElementById(
        "resultSection"
    );


const analysisSection =
    document.getElementById(
        "analysisSection"
    );


const dataSection =
    document.getElementById(
        "dataSection"
    );


const errorMessage =
    document.getElementById(
        "errorMessage"
    );


const predictButton =
    document.getElementById(
        "predictButton"
    );


const resetButton =
    document.getElementById(
        "resetButton"
    );



// =========================================
// PREDICTION FORM SUBMIT
// =========================================

predictionForm.addEventListener(

    "submit",

    async function (event) {


        // Prevent page reload

        event.preventDefault();



        // Clear previous error

        errorMessage.textContent = "";



        // Get input values

        const Sea_Surface_Temperature =
            document.getElementById(
                "Sea_Surface_Temperature"
            ).value;


        const Atmospheric_Pressure =
            document.getElementById(
                "Atmospheric_Pressure"
            ).value;


        const Humidity =
            document.getElementById(
                "Humidity"
            ).value;


        const Wind_Shear =
            document.getElementById(
                "Wind_Shear"
            ).value;


        const Vorticity =
            document.getElementById(
                "Vorticity"
            ).value;


        const Latitude =
            document.getElementById(
                "Latitude"
            ).value;


        const Ocean_Depth =
            document.getElementById(
                "Ocean_Depth"
            ).value;


        const Proximity_to_Coastline =
            document.getElementById(
                "Proximity_to_Coastline"
            ).value;


        const Pre_existing_Disturbance =
            document.getElementById(
                "Pre_existing_Disturbance"
            ).value;



        // =================================
        // VALIDATION
        // =================================

        const values = [

            Sea_Surface_Temperature,

            Atmospheric_Pressure,

            Humidity,

            Wind_Shear,

            Vorticity,

            Latitude,

            Ocean_Depth,

            Proximity_to_Coastline,

            Pre_existing_Disturbance

        ];



        // Check empty values

        for (

            let value of values

        ) {

            if (

                value === ""

            ) {

                errorMessage.textContent =
                    "Please fill in all environmental conditions.";

                return;

            }

        }



        // Convert to numbers

        const payload = {

            Sea_Surface_Temperature:
                Number(
                    Sea_Surface_Temperature
                ),

            Atmospheric_Pressure:
                Number(
                    Atmospheric_Pressure
                ),

            Humidity:
                Number(
                    Humidity
                ),

            Wind_Shear:
                Number(
                    Wind_Shear
                ),

            Vorticity:
                Number(
                    Vorticity
                ),

            Latitude:
                Number(
                    Latitude
                ),

            Ocean_Depth:
                Number(
                    Ocean_Depth
                ),

            Proximity_to_Coastline:
                Number(
                    Proximity_to_Coastline
                ),

            Pre_existing_Disturbance:
                Number(
                    Pre_existing_Disturbance
                )

        };



        // Check invalid numbers

        for (

            let key in payload

        ) {

            if (

                Number.isNaN(
                    payload[key]
                )

            ) {

                errorMessage.textContent =
                    "Please enter valid numeric values.";

                return;

            }

        }



        // =================================
        // BUTTON LOADING STATE
        // =================================

        predictButton.textContent =
            "Predicting...";

        predictButton.disabled =
            true;



        try {


            // =================================
            // API REQUEST
            // =================================

            const response =
                await fetch(

                    API_URL,

                    {

                        method: "POST",

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



            // =================================
            // HANDLE SERVER ERROR
            // =================================

            if (

                !response.ok

            ) {

                throw new Error(

                    "Prediction request failed."

                );

            }



            // =================================
            // GET RESPONSE DATA
            // =================================

            const data =
                await response.json();



            console.log(

                "API Response:",

                data

            );



            // =================================
            // SHOW RESULT
            // =================================

            displayPrediction(
                data
            );



        }

        catch (

            error

        ) {


            console.error(
                error
            );


            errorMessage.textContent =

                "Unable to connect to the prediction server. " +

                "Make sure the FastAPI server is running."

        }


        finally {


            predictButton.textContent =
                "Predict Cyclone";


            predictButton.disabled =
                false;

        }


    }

);



// =========================================
// DISPLAY PREDICTION
// =========================================

function displayPrediction(

    data

) {


    // Show prediction result

    resultSection.classList.remove(
        "hidden"
    );



    // Prediction text

    document.getElementById(

        "predictionText"

    ).textContent =

        data.prediction;



    // Classification

    document.getElementById(

        "classificationText"

    ).textContent =

        data.classification ||

        "";



    // =====================================
    // CYCLONE PROBABILITY
    // =====================================

    const cycloneProbability =

        Number(
            data.cyclone_probability
        );



    document.getElementById(

        "cycloneProbabilityText"

    ).textContent =

        cycloneProbability + "%";



    document.getElementById(

        "cycloneBar"

    ).style.width =

        cycloneProbability + "%";



    // =====================================
    // NO CYCLONE PROBABILITY
    // =====================================

    const noCycloneProbability =

        Number(
            data.no_cyclone_probability
        );



    document.getElementById(

        "noCycloneProbabilityText"

    ).textContent =

        noCycloneProbability + "%";



    document.getElementById(

        "noCycloneBar"

    ).style.width =

        noCycloneProbability + "%";



    // =====================================
    // FEATURE IMPORTANCE
    // =====================================

    if (

        data.top_important_features

    ) {


        displayFeatureImportance(

            data.top_important_features

        );


        analysisSection.classList.remove(
            "hidden"
        );

    }



    // =====================================
    // DATA SOURCES
    // =====================================

    if (

        data.data_sources

    ) {


        displayDataCategories(

            data.data_sources

        );


        dataSection.classList.remove(
            "hidden"
        );

    }



    // Scroll to result

    setTimeout(

        function () {

            resultSection.scrollIntoView(

                {

                    behavior:
                        "smooth",

                    block:
                        "start"

                }

            );

        },

        100

    );



}



// =========================================
// FEATURE IMPORTANCE
// =========================================

function displayFeatureImportance(

    features

) {


    const container =
        document.getElementById(

            "featureImportanceContainer"

        );



    // Clear previous content

    container.innerHTML =
        "";



    features.forEach(

        function (

            item

        ) {


            const featureName =

                formatFeatureName(

                    item.feature

                );



            const importance =

                Number(

                    item.importance

                );



            const featureHTML =

                `

                <div class="feature-item">

                    <div class="feature-header">

                        <span>

                            ${featureName}

                        </span>


                        <span>

                            ${importance.toFixed(2)}%

                        </span>

                    </div>


                    <div
                        class="feature-background"
                    >

                        <div
                            class="feature-bar"

                            style="
                                width:
                                ${importance}%
                            "
                        ></div>

                    </div>

                </div>

                `;



            container.innerHTML +=
                featureHTML;


        }

    );


}



// =========================================
// DATA CATEGORIES
// =========================================

function displayDataCategories(

    categories

) {


    const container =
        document.getElementById(

            "dataCategories"

        );



    // Clear previous content

    container.innerHTML =
        "";



    for (

        const category in categories

    ) {


        const features =

            categories[
                category
            ];



        let featureList =
            "";



        features.forEach(

            function (

                feature

            ) {


                featureList +=

                    `

                    <li>

                        ${formatFeatureName(
                            feature
                        )}

                    </li>

                    `;

            }

        );



        const categoryHTML =

            `

            <div
                class="category-card"
            >

                <h3>

                    ${formatCategoryName(
                        category
                    )}

                </h3>


                <ul>

                    ${featureList}

                </ul>


            </div>

            `;



        container.innerHTML +=
            categoryHTML;


    }


}



// =========================================
// FORMAT FEATURE NAME
// =========================================

function formatFeatureName(

    feature

) {


    return feature

        .replace(
            /_/g,
            " "
        )

        .replace(

            /\b\w/g,

            function (

                letter

            ) {

                return letter.toUpperCase();

            }

        );



}



// =========================================
// FORMAT CATEGORY NAME
// =========================================

function formatCategoryName(

    category

) {


    return category

        .replace(
            /_/g,
            " "
        )

        .replace(

            /\b\w/g,

            function (

                letter

            ) {

                return letter.toUpperCase();

            }

        );



}



// =========================================
// RESET BUTTON
// =========================================

resetButton.addEventListener(

    "click",

    function () {


        // Reset form

        predictionForm.reset();



        // Clear error

        errorMessage.textContent =
            "";



        // Hide sections

        resultSection.classList.add(
            "hidden"
        );


        analysisSection.classList.add(
            "hidden"
        );


        dataSection.classList.add(
            "hidden"
        );



        // Clear feature analysis

        document.getElementById(

            "featureImportanceContainer"

        ).innerHTML =

            "";



        // Clear categories

        document.getElementById(

            "dataCategories"

        ).innerHTML =

            "";



        // Reset bars

        document.getElementById(

            "cycloneBar"

        ).style.width =

            "0%";



        document.getElementById(

            "noCycloneBar"

        ).style.width =

            "0%";



        // Scroll to top

        window.scrollTo(

            {

                top: 0,

                behavior:
                    "smooth"

            }

        );


    }

);