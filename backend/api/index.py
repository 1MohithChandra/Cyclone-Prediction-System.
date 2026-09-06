from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import pandas as pd
import joblib
import os


# -----------------------------------
# GET BACKEND DIRECTORY
# -----------------------------------

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)


# -----------------------------------
# CREATE FASTAPI APPLICATION
# -----------------------------------

app = FastAPI(
    title="Cyclone Prediction API",
    description=(
        "AI/ML API for identification, classification "
        "and prediction of tropical cyclone patterns"
    )
)


# -----------------------------------
# ENABLE CORS
# -----------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",

        # Replace this with your exact frontend Vercel URL
        "https://cyclone-prediction-system.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------------
# LOAD TRAINED MODEL
# -----------------------------------

model_path = os.path.join(
    BASE_DIR,
    "cyclone_model.pkl"
)

model = joblib.load(
    model_path
)


# -----------------------------------
# LOAD FEATURE INFORMATION
# -----------------------------------

feature_info_path = os.path.join(
    BASE_DIR,
    "feature_info.pkl"
)

feature_info = joblib.load(
    feature_info_path
)


# -----------------------------------
# REQUEST DATA STRUCTURE
# -----------------------------------

class CycloneInput(BaseModel):

    Sea_Surface_Temperature: float

    Atmospheric_Pressure: float

    Humidity: float

    Wind_Shear: float

    Vorticity: float

    Latitude: float

    Ocean_Depth: float

    Proximity_to_Coastline: float

    Pre_existing_Disturbance: int


# -----------------------------------
# HOME ROUTE
# -----------------------------------

@app.get("/")
def home():

    return {
        "message":
            "Cyclone Prediction API is running successfully",

        "status":
            "online"
    }


# -----------------------------------
# FEATURE INFORMATION ROUTE
# -----------------------------------

@app.get("/feature-information")
def get_feature_information():

    return feature_info


# -----------------------------------
# PREDICTION ROUTE
# -----------------------------------

@app.post("/predict")
def predict_cyclone(data: CycloneInput):


    # -----------------------------------
    # CONVERT INPUT INTO DATAFRAME
    # -----------------------------------

    input_data = pd.DataFrame([
        {

            "Sea_Surface_Temperature":
                data.Sea_Surface_Temperature,

            "Atmospheric_Pressure":
                data.Atmospheric_Pressure,

            "Humidity":
                data.Humidity,

            "Wind_Shear":
                data.Wind_Shear,

            "Vorticity":
                data.Vorticity,

            "Latitude":
                data.Latitude,

            "Ocean_Depth":
                data.Ocean_Depth,

            "Proximity_to_Coastline":
                data.Proximity_to_Coastline,

            "Pre_existing_Disturbance":
                data.Pre_existing_Disturbance
        }
    ])


    # -----------------------------------
    # GET PREDICTION
    # -----------------------------------

    prediction = model.predict(
        input_data
    )[0]


    # -----------------------------------
    # GET PROBABILITIES
    # -----------------------------------

    probabilities = model.predict_proba(
        input_data
    )[0]


    no_cyclone_probability = round(
        float(probabilities[0]) * 100,
        2
    )


    cyclone_probability = round(
        float(probabilities[1]) * 100,
        2
    )


    # -----------------------------------
    # IDENTIFICATION
    # -----------------------------------

    if prediction == 1:

        result = "Cyclone Detected"

    else:

        result = "No Cyclone Detected"


    # -----------------------------------
    # CLASSIFICATION
    # -----------------------------------

    if prediction == 0:

        classification = (
            "No Cyclone Pattern"
        )

    elif cyclone_probability >= 80:

        classification = (
            "Strong Cyclone Pattern"
        )

    elif cyclone_probability >= 60:

        classification = (
            "Developing Cyclone Pattern"
        )

    else:

        classification = (
            "Weak Cyclone Pattern"
        )


    # -----------------------------------
    # FEATURE IMPORTANCE
    # -----------------------------------

    importance_values = (
        model.feature_importances_
    )


    feature_importance = []


    for feature, importance in zip(

        model.feature_names_in_,

        importance_values

    ):

        feature_importance.append({

            "feature":
                feature,

            "importance":
                round(
                    float(importance) * 100,
                    2
                )

        })


    # -----------------------------------
    # SORT FEATURE IMPORTANCE
    # -----------------------------------

    feature_importance = sorted(

        feature_importance,

        key=lambda x:
            x["importance"],

        reverse=True

    )


    # -----------------------------------
    # GET TOP 5 FEATURES
    # -----------------------------------

    top_important_features = (
        feature_importance[:5]
    )


    # -----------------------------------
    # RETURN RESULT
    # -----------------------------------

    return {

        "prediction":
            result,

        "classification":
            classification,

        "cyclone_probability":
            cyclone_probability,

        "no_cyclone_probability":
            no_cyclone_probability,

        "top_important_features":
            top_important_features,

        "data_sources":
            feature_info[
                "data_sources"
            ]

    }