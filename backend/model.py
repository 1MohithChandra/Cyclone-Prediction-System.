import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report


# -----------------------------------
# 1. LOAD DATASET
# -----------------------------------

df = pd.read_csv("data/cyclone_dataset.csv")


# -----------------------------------
# 2. DEFINE INPUT FEATURES
# -----------------------------------

features = [
    "Sea_Surface_Temperature",
    "Atmospheric_Pressure",
    "Humidity",
    "Wind_Shear",
    "Vorticity",
    "Latitude",
    "Ocean_Depth",
    "Proximity_to_Coastline",
    "Pre_existing_Disturbance"
]

X = df[features]


# -----------------------------------
# 3. DEFINE TARGET
# -----------------------------------

y = df["Cyclone"]


# -----------------------------------
# 4. CHECK DATASET
# -----------------------------------

print("\nDATASET INFORMATION")

print("\nDataset Shape:")
print(df.shape)

print("\nCyclone Distribution:")
print(y.value_counts())


# -----------------------------------
# 5. SPLIT DATA
# -----------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# -----------------------------------
# 6. CREATE MODEL
# -----------------------------------

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)


# -----------------------------------
# 7. TRAIN MODEL
# -----------------------------------

model.fit(X_train, y_train)


# -----------------------------------
# 8. TEST MODEL
# -----------------------------------

predictions = model.predict(X_test)

accuracy = accuracy_score(
    y_test,
    predictions
)


print("\nMODEL ACCURACY:")
print(f"{accuracy * 100:.2f}%")


print("\nCLASSIFICATION REPORT:")

print(
    classification_report(
        y_test,
        predictions
    )
)


# -----------------------------------
# 9. FEATURE IMPORTANCE
# -----------------------------------

importance_df = pd.DataFrame({
    "Feature": features,
    "Importance": model.feature_importances_
})

importance_df = importance_df.sort_values(
    by="Importance",
    ascending=False
)

print("\nFEATURE IMPORTANCE:")
print(importance_df)


# -----------------------------------
# 10. SAVE MODEL
# -----------------------------------

joblib.dump(
    model,
    "cyclone_model.pkl"
)


# -----------------------------------
# 11. SAVE FEATURE NAMES
# -----------------------------------

joblib.dump(
    features,
    "features.pkl"
)


# -----------------------------------
# 12. SAVE FEATURE INFORMATION
# -----------------------------------

feature_info = {
    "features": features,

    "data_sources": {
        "ocean_conditions": [
            "Sea_Surface_Temperature",
            "Ocean_Depth",
            "Proximity_to_Coastline"
        ],

        "atmospheric_conditions": [
            "Atmospheric_Pressure",
            "Humidity",
            "Wind_Shear",
            "Vorticity"
        ],

        "geographical_conditions": [
            "Latitude"
        ],

        "cyclone_development_conditions": [
            "Pre_existing_Disturbance"
        ]
    }
}


joblib.dump(
    feature_info,
    "feature_info.pkl"
)


# -----------------------------------
# 13. SUCCESS MESSAGE
# -----------------------------------

print("\nMODEL SAVED SUCCESSFULLY!")
print("cyclone_model.pkl")

print("\nFEATURE FILE SAVED SUCCESSFULLY!")
print("features.pkl")

print("\nFEATURE INFORMATION SAVED SUCCESSFULLY!")
print("feature_info.pkl")