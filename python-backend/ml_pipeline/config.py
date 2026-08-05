import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASETS_DIR = os.path.join(BASE_DIR, 'datasets')
MODELS_DIR = os.path.join(BASE_DIR, 'models')
REPORTS_DIR = os.path.join(BASE_DIR, 'reports')

# Ensure directories exist
for directory in [DATASETS_DIR, MODELS_DIR, REPORTS_DIR]:
    os.makedirs(directory, exist_ok=True)

# Disease Specific Feature Lists and Target Variables
DISEASES = {
    'heart': {
        'target': 'target',
        'categorical_features': ['sex', 'cp', 'fbs', 'restecg', 'exang', 'slope', 'ca', 'thal'],
        'continuous_features': ['age', 'trestbps', 'chol', 'thalach', 'oldpeak'],
        'drop_features': []
    },
    'diabetes': {
        'target': 'Outcome',
        'categorical_features': [],
        'continuous_features': ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age'],
        'drop_features': []
    },
    'liver': {
        'target': 'Dataset', # 1 for disease, 2 for no disease (requires mapping to 0/1)
        'categorical_features': ['Gender'],
        'continuous_features': ['Age', 'Total_Bilirubin', 'Direct_Bilirubin', 'Alkaline_Phosphotase', 'Alamine_Aminotransferase', 'Aspartate_Aminotransferase', 'Total_Protiens', 'Albumin', 'Albumin_and_Globulin_Ratio'],
        'drop_features': []
    },
    'parkinson': {
        'target': 'status',
        'categorical_features': [],
        'continuous_features': ['MDVP:Fo(Hz)', 'MDVP:Fhi(Hz)', 'MDVP:Flo(Hz)', 'MDVP:Jitter(%)', 'MDVP:Jitter(Abs)', 'MDVP:RAP', 'MDVP:PPQ', 'Jitter:DDP', 'MDVP:Shimmer', 'MDVP:Shimmer(dB)', 'Shimmer:APQ3', 'Shimmer:APQ5', 'MDVP:APQ', 'Shimmer:DDA', 'NHR', 'HNR', 'RPDE', 'DFA', 'spread1', 'spread2', 'D2', 'PPE'],
        'drop_features': ['name'] # Usually patient names are present in Parkinson dataset
    }
}

# Optuna configuration
OPTUNA_TRIALS = 50
CV_FOLDS = 10
RANDOM_STATE = 42
