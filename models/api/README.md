# Exoplanet Classification API

A FastAPI wrapper for the trained Random Forest model that classifies exoplanet candidates as confirmed planets or false positives.

## Features

- **Single Prediction**: Classify individual exoplanet candidates
- **Batch Prediction**: Process multiple candidates at once
- **Input Validation**: Comprehensive validation of input parameters
- **Model Metadata**: Access to model information and feature descriptions
- **Health Monitoring**: Health check endpoints for monitoring
- **Interactive Documentation**: Auto-generated API docs with Swagger UI

## Installation

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Ensure the model file exists in one of these locations:
   - `models/best_koi_reduced_rf.joblib`
   - `../exo_classification/models/best_koi_reduced_rf.joblib`
   - `../test_classification/models/best_koi_reduced_rf.joblib`

## Running the API

### Development Mode

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

The API will be available at:

- **API**: <http://localhost:8000>
- **Interactive Docs**: <http://localhost:8000/docs>
- **ReDoc**: <http://localhost:8000/redoc>

## API Endpoints

### 1. Health Check

```http
GET /health
```

Returns the health status of the API and model loading status.

### 2. Model Information

```http
GET /model/info
```

Returns detailed information about the loaded model, including required features and their descriptions.

### 3. Single Prediction

```http
POST /predict
```

**Request Body:**

```json
{
  "koi_period": 365.25,
  "koi_duration": 2.5,
  "koi_depth": 1000,
  "koi_impact": 0.3,
  "koi_srho": 1.4,
  "koi_incl": 89.5
}
```

**Response:**

```json
{
  "prediction": 1,
  "probability": 0.8542,
  "confidence": "HIGH",
  "threshold_used": 0.5,
  "model_info": {
    "threshold": 0.5,
    "features": ["koi_period", "koi_duration", "koi_depth", "koi_impact", "koi_srho", "koi_incl"],
    "model_type": "Random Forest",
    "version": "1.0.0"
  }
}
```

### 4. Batch Prediction

```http
POST /predict/batch
```

**Request Body:**

```json
{
  "candidates": [
    {
      "koi_period": 10.5,
      "koi_duration": 1.2,
      "koi_depth": 500,
      "koi_impact": 0.1,
      "koi_srho": 2.0,
      "koi_incl": 88.0
    },
    {
      "koi_period": 100.0,
      "koi_duration": 3.0,
      "koi_depth": 2000,
      "koi_impact": 0.5,
      "koi_srho": 1.0,
      "koi_incl": 89.0
    }
  ]
}
```

### 5. Model Reload

```http
POST /model/reload
```

Reloads the model from disk (useful for model updates without restarting the API).

## Input Parameters

| Parameter | Type | Required | Description | Range |
|-----------|------|----------|-------------|-------|
| `koi_period` | float | ✅ | Orbital period in days | > 0 |
| `koi_duration` | float | ✅ | Transit duration in hours | > 0 |
| `koi_depth` | float | ✅ | Transit depth in parts per million | > 0 |
| `koi_impact` | float | ❌ | Impact parameter | 0-1 |
| `koi_srho` | float | ❌ | Stellar density in g/cm³ | > 0 |
| `koi_incl` | float | ❌ | Orbital inclination in degrees | 0-180 |

## Output Format

### Prediction Response

- **prediction**: 0 (False Positive) or 1 (Confirmed Planet)
- **probability**: Confidence score (0-1)
- **confidence**: HIGH/MEDIUM/LOW based on probability
- **threshold_used**: Classification threshold used
- **model_info**: Model metadata

### Confidence Levels

- **HIGH**: probability ≥ 0.8 or ≤ 0.2
- **MEDIUM**: 0.4 < probability < 0.6
- **LOW**: 0.2 < probability < 0.8

## Testing

Run the test script to verify the API:

```bash
python test_api.py
```

This will test all endpoints with sample data.

## Example Usage

### Python

```python
import requests

# Single prediction
response = requests.post("http://localhost:8000/predict", json={
    "koi_period": 365.25,
    "koi_duration": 2.5,
    "koi_depth": 1000,
    "koi_impact": 0.3,
    "koi_srho": 1.4,
    "koi_incl": 89.5
})

result = response.json()
print(f"Prediction: {'Planet' if result['prediction'] else 'False Positive'}")
print(f"Probability: {result['probability']:.3f}")
print(f"Confidence: {result['confidence']}")
```

### cURL

```bash
curl -X POST "http://localhost:8000/predict" \
     -H "Content-Type: application/json" \
     -d '{
       "koi_period": 365.25,
       "koi_duration": 2.5,
       "koi_depth": 1000,
       "koi_impact": 0.3,
       "koi_srho": 1.4,
       "koi_incl": 89.5
     }'
```

## Error Handling

The API includes comprehensive error handling:

- **422**: Validation errors for invalid input parameters
- **503**: Service unavailable when model is not loaded
- **500**: Internal server errors during prediction

## Model Requirements

The API expects a model bundle saved as a dictionary containing:

- `model`: The trained scikit-learn model
- `threshold`: Optimal classification threshold
- `features`: List of feature names in training order

## Production Considerations

1. **Security**: Configure CORS origins properly for production
2. **Model Updates**: Use the `/model/reload` endpoint for model updates
3. **Monitoring**: Use `/health` endpoint for health checks
4. **Logging**: Add proper logging for production deployment
5. **Scaling**: Consider using multiple workers for high throughput

## Troubleshooting

### Model Not Loading

- Check that the model file exists in expected locations
- Verify the model file is not corrupted
- Check file permissions

### Validation Errors

- Ensure all required fields are provided
- Check that numeric values are within valid ranges
- Verify data types match expected formats

### Performance Issues

- Consider using batch predictions for multiple candidates
- Monitor memory usage with large batch sizes
- Use appropriate hardware for production deployment
