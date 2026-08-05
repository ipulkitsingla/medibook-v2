from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from datetime import datetime
import uvicorn

from services.model_service import predict_disease

app = FastAPI(title="Medibook AI Clinical Decision Support System API")

class PredictionRequest(BaseModel):
    disease: str
    features: Dict[str, Any]

@app.post("/predict")
async def predict(request: PredictionRequest):
    try:
        # Check if disease is supported
        supported_diseases = ["Heart Disease", "Diabetes", "Parkinson's", "Liver Disease"]
        if request.disease not in supported_diseases:
            raise HTTPException(status_code=400, detail=f"Disease '{request.disease}' not supported.")
        
        result = predict_disease(request.disease, request.features)
        
        # Add generated timestamp
        result["generatedAt"] = datetime.utcnow().isoformat()
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
