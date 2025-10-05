"""
Example usage of the Exoplanet Classification API
"""

import requests
import json
import time

# Configuration
API_BASE_URL = "http://localhost:8000"

def wait_for_api(max_retries=30, delay=1):
    """Wait for the API to be ready"""
    print("⏳ Waiting for API to be ready...")
    
    for i in range(max_retries):
        try:
            response = requests.get(f"{API_BASE_URL}/health", timeout=2)
            if response.status_code == 200:
                data = response.json()
                if data.get("model_loaded"):
                    print("✅ API is ready with model loaded")
                    return True
                else:
                    print("⚠️  API is ready but model not loaded")
                    return False
        except requests.exceptions.RequestException:
            pass
        
        time.sleep(delay)
        print(f"   Attempt {i+1}/{max_retries}...")
    
    print("❌ API not ready after maximum retries")
    return False

def example_single_prediction():
    """Example of single prediction"""
    print("\n🔍 Example: Single Prediction")
    print("-" * 40)
    
    # Example exoplanet candidate (Earth-like)
    candidate = {
        "koi_period": 365.25,  # 1 year orbital period
        "koi_duration": 2.5,    # 2.5 hour transit
        "koi_depth": 1000,      # 1000 ppm depth
        "koi_impact": 0.3,      # Impact parameter
        "koi_srho": 1.4,        # Stellar density (Sun-like)
        "koi_incl": 89.5        # Inclination
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/predict", json=candidate)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Prediction successful!")
            print(f"   Candidate: Earth-like planet")
            print(f"   Prediction: {'🌍 CONFIRMED PLANET' if result['prediction'] else '❌ FALSE POSITIVE'}")
            print(f"   Probability: {result['probability']:.3f}")
            print(f"   Confidence: {result['confidence']}")
            print(f"   Threshold: {result['threshold_used']}")
        else:
            print(f"❌ Prediction failed: {response.status_code}")
            print(f"   Error: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")

def example_batch_prediction():
    """Example of batch prediction"""
    print("\n🔍 Example: Batch Prediction")
    print("-" * 40)
    
    # Multiple exoplanet candidates
    candidates = {
        "candidates": [
            {
                "koi_period": 10.5,    # Short period
                "koi_duration": 1.2,
                "koi_depth": 500,
                "koi_impact": 0.1,
                "koi_srho": 2.0,
                "koi_incl": 88.0
            },
            {
                "koi_period": 100.0,   # Medium period
                "koi_duration": 3.0,
                "koi_depth": 2000,
                "koi_impact": 0.5,
                "koi_srho": 1.0,
                "koi_incl": 89.0
            },
            {
                "koi_period": 1.0,     # Very short period (hot Jupiter)
                "koi_duration": 0.5,
                "koi_depth": 100,
                "koi_impact": 0.8,
                "koi_srho": 3.0,
                "koi_incl": 87.0
            }
        ]
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/predict/batch", json=candidates)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Batch prediction successful!")
            print(f"   Total candidates: {result['summary']['total_candidates']}")
            print(f"   Predicted planets: {result['summary']['predicted_planets']}")
            print(f"   Predicted false positives: {result['summary']['predicted_false_positives']}")
            print(f"   Mean probability: {result['summary']['mean_probability']:.3f}")
            print(f"   High confidence: {result['summary']['high_confidence']}")
            
            print("\n   Individual predictions:")
            for pred in result['predictions']:
                status = "🌍 PLANET" if pred['prediction'] else "❌ FALSE POSITIVE"
                print(f"     Candidate {pred['candidate_id']}: {status} (prob: {pred['probability']:.3f}, conf: {pred['confidence']})")
        else:
            print(f"❌ Batch prediction failed: {response.status_code}")
            print(f"   Error: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")

def example_model_info():
    """Example of getting model information"""
    print("\n🔍 Example: Model Information")
    print("-" * 40)
    
    try:
        response = requests.get(f"{API_BASE_URL}/model/info")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Model information retrieved!")
            print(f"   Model type: {result['model_info']['model_type']}")
            print(f"   Version: {result['model_info']['version']}")
            print(f"   Threshold: {result['model_info']['threshold']}")
            print(f"   Features: {', '.join(result['model_info']['features'])}")
            
            print("\n   Feature descriptions:")
            for feature, description in result['feature_descriptions'].items():
                print(f"     {feature}: {description}")
        else:
            print(f"❌ Failed to get model info: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")

def example_edge_cases():
    """Example of edge cases and validation"""
    print("\n🔍 Example: Edge Cases")
    print("-" * 40)
    
    # Test with minimal required fields
    print("Testing with minimal fields...")
    minimal_candidate = {
        "koi_period": 50.0,
        "koi_duration": 2.0,
        "koi_depth": 1500
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/predict", json=minimal_candidate)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Minimal fields prediction successful!")
            print(f"   Prediction: {'🌍 PLANET' if result['prediction'] else '❌ FALSE POSITIVE'}")
            print(f"   Probability: {result['probability']:.3f}")
        else:
            print(f"❌ Minimal fields prediction failed: {response.status_code}")
            print(f"   Error: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
    
    # Test with invalid data
    print("\nTesting with invalid data...")
    invalid_candidate = {
        "koi_period": -10,  # Invalid negative period
        "koi_duration": 2.0,
        "koi_depth": 1000
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/predict", json=invalid_candidate)
        
        if response.status_code == 422:  # Validation error
            print("✅ Validation correctly rejected invalid data")
            error_data = response.json()
            print(f"   Validation error: {error_data.get('detail', 'Unknown error')}")
        else:
            print(f"❌ Expected validation error, got: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")

def main():
    """Main example function"""
    print("🚀 Exoplanet Classification API Examples")
    print("=" * 50)
    
    # Wait for API to be ready
    if not wait_for_api():
        print("❌ Cannot proceed without API")
        return
    
    # Run examples
    example_model_info()
    example_single_prediction()
    example_batch_prediction()
    example_edge_cases()
    
    print("\n✅ All examples completed!")
    print("\n📚 For more information, visit: http://localhost:8000/docs")

if __name__ == "__main__":
    main()
