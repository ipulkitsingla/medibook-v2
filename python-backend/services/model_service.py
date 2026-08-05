import os
import pickle
import shap
import pandas as pd
import numpy as np

# Load models
models = {}
explainer_cache = {}

def get_model_path(model_name):
    # Depending on where the script is run from, adjust path
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base_dir, 'models', f"{model_name}.pkl")

def load_model(disease_type):
    model_name = ""
    if disease_type == "Heart Disease":
        model_name = "heart_rf_v1"
    elif disease_type == "Diabetes":
        model_name = "diabetes_rf_v1"
    elif disease_type == "Parkinson's":
        model_name = "parkinson_rf_v1"
    elif disease_type == "Liver Disease":
        model_name = "liver_rf_v1"
    else:
        raise ValueError("Invalid disease type")
        
    if model_name not in models:
        path = get_model_path(model_name)
        if not os.path.exists(path):
            raise FileNotFoundError(f"Model file not found: {path}")
        with open(path, 'rb') as f:
            models[model_name] = pickle.load(f)
            
    return models[model_name], model_name

def get_explainer(model, model_name):
    if model_name not in explainer_cache:
        # For RandomForest, TreeExplainer is appropriate
        explainer_cache[model_name] = shap.TreeExplainer(model)
    return explainer_cache[model_name]

def predict_disease(disease_type: str, features_dict: dict):
    model, model_name = load_model(disease_type)
    
    # Ensure features match what the model expects
    df = pd.DataFrame([features_dict])
    
    # Fill missing features with 0 (or median) to allow partial data predictions
    if hasattr(model, 'feature_names_in_'):
        for feature in model.feature_names_in_:
            if feature not in df.columns:
                df[feature] = 0.0
        # Reorder columns to match exactly what the model expects
        df = df[model.feature_names_in_]
    
    # Predict probability (class 1 is usually the disease presence)
    proba = model.predict_proba(df)[0]
    risk_score = round(proba[1] * 100, 2)
    
    prediction_label = "High Risk" if risk_score > 50 else "Low Risk"
    risk_category = "High" if risk_score > 70 else ("Moderate" if risk_score > 30 else "Low")
    
    # Calculate SHAP values
    explainer = get_explainer(model, model_name)
    shap_values = explainer.shap_values(df)
    
    # Handle SHAP structure (binary classification)
    if isinstance(shap_values, list):
        shap_vals_class1 = shap_values[1][0]
    elif hasattr(shap_values, 'shape') and len(shap_values.shape) == 3:
        # Shape: (n_samples, n_features, n_classes)
        shap_vals_class1 = shap_values[0, :, 1]
    else:
        # Shape: (n_samples, n_features)
        shap_vals_class1 = shap_values[0]
        
    feature_names = df.columns.tolist()
    
    shap_results = []
    top_factors = []
    
    for idx, feature in enumerate(feature_names):
        val = float(shap_vals_class1[idx])
        feature_val = float(df.iloc[0, idx])
        shap_results.append({
            "feature": feature,
            "value": val,
            "actualValue": feature_val
        })
        
    # Sort by absolute SHAP value to get top factors
    shap_results.sort(key=lambda x: abs(x["value"]), reverse=True)
    
    for sr in shap_results[:3]: # Top 3 factors
        direction = "increased" if sr["value"] > 0 else "decreased"
        top_factors.append({
            "feature": sr["feature"],
            "impact": sr["value"],
            "description": f"{sr['feature']} ({sr['actualValue']}) significantly {direction} the risk."
        })
        
    # Generate recommendations based on disease and risk
    recommendations = []
    department = ""
    if disease_type == "Heart Disease":
        department = "Cardiology"
        if risk_category == "High":
            recommendations = ["Consult Cardiologist immediately", "Schedule an ECG", "Reduce salt and saturated fat intake"]
        else:
            recommendations = ["Maintain regular exercise", "Monitor blood pressure"]
    elif disease_type == "Diabetes":
        department = "Endocrinology"
        if risk_category == "High":
            recommendations = ["Consult Endocrinologist", "Take an HbA1c test", "Strict sugar reduction"]
        else:
            recommendations = ["Daily walking", "Balanced diet low in simple carbs"]
    elif disease_type == "Parkinson's":
        department = "Neurology"
        if risk_category == "High":
            recommendations = ["Schedule a Neurological Assessment", "Consider physical therapy consultation"]
        else:
            recommendations = ["Maintain healthy active lifestyle"]
    elif disease_type == "Liver Disease":
        department = "Gastroenterology"
        if risk_category == "High":
            recommendations = ["Consult Gastroenterologist or Hepatologist", "Avoid alcohol", "Reduce fatty foods"]
        else:
            recommendations = ["Maintain healthy weight", "Drink plenty of water"]

    return {
        "prediction": prediction_label,
        "confidence": round(max(proba) * 100, 2), # Model confidence in its prediction
        "riskScore": risk_score, # Risk of having the disease (probability of class 1)
        "riskCategory": risk_category,
        "recommendedDepartment": department,
        "recommendations": recommendations,
        "topFactors": top_factors,
        "shapValues": shap_results,
        "modelVersion": model_name
    }
