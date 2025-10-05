"""
FastAPI wrapper for Exoplanet Classification Random Forest Model
"""

import os
import sys
import joblib
import numpy as np
import pandas as pd
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field, validator
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Add parent directory to path to access model files
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Initialize FastAPI app
app = FastAPI(
    title="Exoplanet Classification API",
    description="API for classifying exoplanet candidates using Random Forest model",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and metadata
model = None
model_metadata = {}
model_loaded = False

# Pydantic models for request/response
class ExoplanetFeatures(BaseModel):
    """Input features for exoplanet classification"""
    koi_period: float = Field(..., description="Orbital period in days", gt=0)
    koi_duration: float = Field(..., description="Transit duration in hours", gt=0)
    koi_depth: float = Field(..., description="Transit depth in parts per million", gt=0)
    koi_impact: Optional[float] = Field(None, description="Impact parameter (0-1)", ge=0, le=1)
    koi_srho: Optional[float] = Field(None, description="Stellar density in g/cm³", gt=0)
    koi_incl: Optional[float] = Field(None, description="Orbital inclination in degrees", ge=0, le=180)
    
    @validator('koi_period')
    def validate_period(cls, v):
        if v <= 0:
            raise ValueError('Orbital period must be positive')
        if v > 10000:  # Reasonable upper limit
            raise ValueError('Orbital period seems too large (>10000 days)')
        return v
    
    @validator('koi_duration')
    def validate_duration(cls, v):
        if v <= 0:
            raise ValueError('Transit duration must be positive')
        if v > 24:  # Reasonable upper limit for transit duration
            raise ValueError('Transit duration seems too large (>24 hours)')
        return v
    
    @validator('koi_depth')
    def validate_depth(cls, v):
        if v <= 0:
            raise ValueError('Transit depth must be positive')
        if v > 100000:  # Reasonable upper limit
            raise ValueError('Transit depth seems too large (>100000 ppm)')
        return v

class PredictionResponse(BaseModel):
    """Response model for predictions"""
    prediction: int = Field(..., description="Predicted class (0=FALSE POSITIVE, 1=CONFIRMED PLANET)")
    probability: float = Field(..., description="Prediction probability (0-1)")
    confidence: str = Field(..., description="Confidence level (LOW/MEDIUM/HIGH)")
    threshold_used: float = Field(..., description="Classification threshold used")
    model_info: Dict[str, Any] = Field(..., description="Model metadata")

class BatchPredictionRequest(BaseModel):
    """Request model for batch predictions"""
    candidates: List[ExoplanetFeatures] = Field(..., description="List of exoplanet candidates")

class BatchPredictionResponse(BaseModel):
    """Response model for batch predictions"""
    predictions: List[Dict[str, Any]] = Field(..., description="List of predictions")
    summary: Dict[str, Any] = Field(..., description="Summary statistics")

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    model_loaded: bool
    model_info: Optional[Dict[str, Any]] = None

def load_model():
    """Load the trained model and metadata"""
    global model, model_metadata, model_loaded
    
    try:
        # Try to find the model file
        model_paths = [
            "models/best_koi_reduced_rf.joblib",
            "../exo_classification/models/best_koi_reduced_rf.joblib",
            "exo_classification/models/best_koi_reduced_rf.joblib",
            "test_classification/models/best_koi_reduced_rf.joblib"
        ]
        
        model_path = None
        for path in model_paths:
            if os.path.exists(path):
                model_path = path
                break
        
        if model_path is None:
            raise FileNotFoundError("Model file not found in any expected location")
        
        # Load the model bundle
        bundle = joblib.load(model_path)
        print(f"✅ Loaded model from: {model_path}")
        
        if isinstance(bundle, dict):
            # New bundle format
            model = bundle.get("model")
            model_metadata = {
                "threshold": bundle.get("threshold", 0.5),
                "features": bundle.get("features", ["koi_period", "koi_duration", "koi_depth", "koi_impact", "koi_srho", "koi_incl"]),
                "model_type": "Random Forest",
                "version": "1.0.0"
            }
        else:
            # Legacy format
            model = bundle
            model_metadata = {
                "threshold": 0.5,
                "features": ["koi_period", "koi_duration", "koi_depth", "koi_impact", "koi_srho", "koi_incl"],
                "model_type": "Random Forest",
                "version": "1.0.0"
            }
        
        model_loaded = True
        print(f"✅ Model loaded successfully. Threshold: {model_metadata['threshold']:.3f}")
        
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        model_loaded = False
        raise e

def get_confidence_level(probability: float) -> str:
    """Determine confidence level based on probability"""
    if probability >= 0.8 or probability <= 0.2:
        return "HIGH"
    elif probability >= 0.6 or probability <= 0.4:
        return "MEDIUM"
    else:
        return "LOW"

@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    try:
        load_model()
    except Exception as e:
        print(f"⚠️  Model loading failed: {e}")
        print("API will start but predictions will fail until model is loaded")

@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint"""
    return {
        "message": "Exoplanet Classification API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy" if model_loaded else "unhealthy",
        model_loaded=model_loaded,
        model_info=model_metadata if model_loaded else None
    )

@app.post("/predict", response_model=PredictionResponse)
async def predict_single(features: ExoplanetFeatures):
    """
    Predict exoplanet classification for a single candidate
    
    - **koi_period**: Orbital period in days
    - **koi_duration**: Transit duration in hours  
    - **koi_depth**: Transit depth in parts per million
    - **koi_impact**: Impact parameter (optional, 0-1)
    - **koi_srho**: Stellar density (optional, g/cm³)
    - **koi_incl**: Orbital inclination (optional, degrees)
    """
    if not model_loaded:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Convert to DataFrame with correct feature order
        feature_dict = features.dict()
        df = pd.DataFrame([feature_dict])
        
        # Reorder columns to match training order
        feature_order = model_metadata["features"]
        df = df.reindex(columns=feature_order)
        
        # Convert to numeric and handle missing values
        for col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
        
        # Get prediction probability
        probability = model.predict_proba(df)[0, 1]
        
        # Apply threshold for classification
        threshold = model_metadata["threshold"]
        prediction = 1 if probability >= threshold else 0
        
        # Determine confidence level
        confidence = get_confidence_level(probability)
        
        return PredictionResponse(
            prediction=prediction,
            probability=round(probability, 4),
            confidence=confidence,
            threshold_used=round(threshold, 4),
            model_info=model_metadata
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/predict/batch", response_model=BatchPredictionResponse)
async def predict_batch(request: BatchPredictionRequest):
    """
    Predict exoplanet classification for multiple candidates
    
    Accepts a list of exoplanet candidates and returns predictions for all.
    """
    if not model_loaded:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Convert to DataFrame
        candidates_data = [candidate.dict() for candidate in request.candidates]
        df = pd.DataFrame(candidates_data)
        
        # Reorder columns to match training order
        feature_order = model_metadata["features"]
        df = df.reindex(columns=feature_order)
        
        # Convert to numeric and handle missing values
        for col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
        
        # Get predictions
        probabilities = model.predict_proba(df)[:, 1]
        threshold = model_metadata["threshold"]
        predictions = (probabilities >= threshold).astype(int)
        
        # Prepare response
        results = []
        for i, (prob, pred) in enumerate(zip(probabilities, predictions)):
            results.append({
                "candidate_id": i,
                "prediction": int(pred),
                "probability": round(float(prob), 4),
                "confidence": get_confidence_level(prob)
            })
        
        # Summary statistics
        summary = {
            "total_candidates": len(candidates_data),
            "predicted_planets": int(predictions.sum()),
            "predicted_false_positives": int((predictions == 0).sum()),
            "mean_probability": round(float(probabilities.mean()), 4),
            "high_confidence": sum(1 for p in probabilities if p >= 0.8 or p <= 0.2),
            "threshold_used": round(threshold, 4)
        }
        
        return BatchPredictionResponse(
            predictions=results,
            summary=summary
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {str(e)}")

@app.get("/model/info")
async def get_model_info():
    """Get information about the loaded model"""
    if not model_loaded:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    return {
        "model_info": model_metadata,
        "features_required": model_metadata["features"],
        "feature_descriptions": {
            "koi_period": "Orbital period in days",
            "koi_duration": "Transit duration in hours",
            "koi_depth": "Transit depth in parts per million",
            "koi_impact": "Impact parameter (0-1, optional)",
            "koi_srho": "Stellar density in g/cm³ (optional)",
            "koi_incl": "Orbital inclination in degrees (optional)"
        }
    }

@app.post("/model/reload")
async def reload_model():
    """Reload the model (useful for model updates)"""
    try:
        load_model()
        return {"message": "Model reloaded successfully", "model_info": model_metadata}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model reload failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
