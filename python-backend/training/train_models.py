import os
import pickle
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification

# Define expected features
HEART_FEATURES = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal']
DIABETES_FEATURES = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']
PARKINSON_FEATURES = ['MDVP:Fo(Hz)', 'MDVP:Fhi(Hz)', 'MDVP:Flo(Hz)', 'MDVP:Jitter(%)', 'MDVP:Jitter(Abs)', 'MDVP:RAP', 'MDVP:PPQ', 'Jitter:DDP', 'MDVP:Shimmer', 'MDVP:Shimmer(dB)', 'Shimmer:APQ3', 'Shimmer:APQ5', 'MDVP:APQ', 'Shimmer:DDA', 'NHR', 'HNR', 'RPDE', 'DFA', 'spread1', 'spread2', 'D2', 'PPE']
LIVER_FEATURES = ['Age', 'Gender', 'Total_Bilirubin', 'Direct_Bilirubin', 'Alkaline_Phosphotase', 'Alamine_Aminotransferase', 'Aspartate_Aminotransferase', 'Total_Protiens', 'Albumin', 'Albumin_and_Globulin_Ratio']

def train_and_save_mock_model(model_name, features):
    print(f"Training {model_name}...")
    X, y = make_classification(
        n_samples=1000, 
        n_features=len(features),
        n_informative=len(features) - 2 if len(features) > 2 else len(features),
        n_redundant=0,
        random_state=42
    )
    
    df_X = pd.DataFrame(X, columns=features)
    
    # Random Forest
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(df_X, y)
    
    # Create models dir if not exists
    os.makedirs('../models', exist_ok=True)
    
    model_path = f'../models/{model_name}.pkl'
    with open(model_path, 'wb') as f:
        pickle.dump(rf, f)
    
    print(f"Saved {model_name} to {model_path}")

if __name__ == "__main__":
    # Ensure running in the correct directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(current_dir)
    
    train_and_save_mock_model('heart_rf_v1', HEART_FEATURES)
    train_and_save_mock_model('diabetes_rf_v1', DIABETES_FEATURES)
    train_and_save_mock_model('parkinson_rf_v1', PARKINSON_FEATURES)
    train_and_save_mock_model('liver_rf_v1', LIVER_FEATURES)
    print("All models trained and saved successfully.")
