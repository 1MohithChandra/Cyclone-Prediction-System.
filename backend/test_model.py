import joblib
import pandas as pd


# Load the trained model
model = joblib.load("cyclone_model.pkl")


# Load feature names
features = joblib.load("features.pkl")


# Example input data
sample_data = {
    "Sea_Surface_Temperature": 28.0,
    "Atmospheric_Pressure": 1000.0,
    "Humidity": 85.0,
    "Wind_Shear": 10.0,
    "Vorticity": 0.0001,
    "Latitude": 15.0,
    "Ocean_Depth": 3000.0,
    "Proximity_to_Coastline": 1.0,
    "Pre_existing_Disturbance": 1
}


# Convert input into a DataFrame
input_df = pd.DataFrame(
    [sample_data]
)


# Make prediction
prediction = model.predict(input_df)[0]


# Get probability/confidence
probabilities = model.predict_proba(input_df)[0]


# Display result
print("\nPREDICTION RESULT:")

if prediction == 1:
    print("CYCLONE DETECTED")
else:
    print("NO CYCLONE DETECTED")


print("\nMODEL PROBABILITIES:")

print(f"No Cyclone: {probabilities[0] * 100:.2f}%")
print(f"Cyclone: {probabilities[1] * 100:.2f}%")