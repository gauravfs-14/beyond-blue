"""
Test script for the Exoplanet Classification API
"""

import requests
import json

# API base URL
BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_model_info():
    """Test model info endpoint"""
    print("🔍 Testing model info endpoint...")
    response = requests.get(f"{BASE_URL}/model/info")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_single_prediction():
    """Test single prediction endpoint"""
    print("🔍 Testing single prediction...")
    
    # Example exoplanet candidate
    candidate = {
        "koi_period": 365.25,  # 1 year orbital period
        "koi_duration": 2.5,    # 2.5 hour transit
        "koi_depth": 1000,      # 1000 ppm depth
        "koi_impact": 0.3,      # Impact parameter
        "koi_srho": 1.4,        # Stellar density
        "koi_incl": 89.5        # Inclination
    }
    
    response = requests.post(f"{BASE_URL}/predict", json=candidate)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_batch_prediction():
    """Test batch prediction endpoint"""
    print("🔍 Testing batch prediction...")
    
    # Multiple exoplanet candidates
    candidates = {
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
            },
            {
                "koi_period": 1.0,
                "koi_duration": 0.5,
                "koi_depth": 100,
                "koi_impact": 0.8,
                "koi_srho": 3.0,
                "koi_incl": 87.0
            }
        ]
    }
    
    response = requests.post(f"{BASE_URL}/predict/batch", json=candidates)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_edge_cases():
    """Test edge cases and validation"""
    print("🔍 Testing edge cases...")
    
    # Test with missing optional fields
    candidate_minimal = {
        "koi_period": 50.0,
        "koi_duration": 2.0,
        "koi_depth": 1500
    }
    
    response = requests.post(f"{BASE_URL}/predict", json=candidate_minimal)
    print(f"Minimal fields - Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()
    
    # Test with invalid data
    try:
        invalid_candidate = {
            "koi_period": -10,  # Invalid negative period
            "koi_duration": 2.0,
            "koi_depth": 1000
        }
        response = requests.post(f"{BASE_URL}/predict", json=invalid_candidate)
        print(f"Invalid data - Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Invalid data test failed: {e}")
    print()

if __name__ == "__main__":
    print("🚀 Testing Exoplanet Classification API")
    print("=" * 50)
    
    try:
        test_health()
        test_model_info()
        test_single_prediction()
        test_batch_prediction()
        test_edge_cases()
        
        print("✅ All tests completed!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to API. Make sure it's running on http://localhost:8000")
        print("Start the API with: uvicorn main:app --reload")
    except Exception as e:
        print(f"❌ Test failed: {e}")
