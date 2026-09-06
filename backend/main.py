from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib


# -----------------------------------
# CREATE FASTAPI APPLICATION
# -----------------------------------

app = FastAPI(
    title="Cyclone Prediction API",
    description="AI/ML API for identification, classification and prediction of tropical cyclone patterns"
)


# -----------------------------------
# ENABLE CORS
# -----------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------------
# LOAD TRAINED MODEL
# -----------------------------------

model = joblib.load("cyclone_model.pkl")


# -----------------------------------
# LOAD FEATURE INFORMATION
# -----------------------------------

feature_info = joblib.load("feature_info.pkl")


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
        "message": "Cyclone Prediction API is running successfully"
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

    input_data = pd.DataFrame([{

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

    }])


    # -----------------------------------
    # GET PREDICTION
    # -----------------------------------

    prediction = model.predict(input_data)[0]


    # -----------------------------------
    # GET PROBABILITIES
    # -----------------------------------

    probabilities = model.predict_proba(input_data)[0]


    no_cyclone_probability = round(
        probabilities[0] * 100,
        2
    )


    cyclone_probability = round(
        probabilities[1] * 100,
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

        classification = "No Cyclone Pattern"

    elif cyclone_probability >= 80:

        classification = "Strong Cyclone Pattern"

    elif cyclone_probability >= 60:

        classification = "Developing Cyclone Pattern"

    else:

        classification = "Weak Cyclone Pattern"


    # -----------------------------------
    # GET FEATURE IMPORTANCE
    # -----------------------------------

    importance_values = model.feature_importances_


    feature_importance = []


    for feature, importance in zip(
        model.feature_names_in_,
        importance_values
    ):

        feature_importance.append({

            "feature": feature,

            "importance": round(
                float(importance) * 100,
                2
            )

        })


    # Sort highest importance first

    feature_importance = sorted(

        feature_importance,

        key=lambda x: x["importance"],

        reverse=True

    )


    # Get top 5 features

    top_important_features = feature_importance[:5]


    # -----------------------------------
    # RETURN RESULT
    # -----------------------------------

    return {

        "prediction": result,

        "classification": classification,

        "cyclone_probability": cyclone_probability,

        "no_cyclone_probability": no_cyclone_probability,

        "top_important_features": top_important_features,

        "data_sources": feature_info["data_sources"]

    }