#!/usr/bin/env python3
"""
Test script to verify model loading before starting the API
"""

import os
import sys
import joblib

def test_model_loading():
    """Test if the model can be loaded successfully"""
    print("🔍 Testing model loading...")
    
    # Model paths to check
    model_paths = [
        "models/best_koi_reduced_rf.joblib",
        "../exo_classification/models/best_koi_reduced_rf.joblib",
        "exo_classification/models/best_koi_reduced_rf.joblib",
        "test_classification/models/best_koi_reduced_rf.joblib"
    ]
    
    print("Checking for model files:")
    for path in model_paths:
        exists = os.path.exists(path)
        status = "✅" if exists else "❌"
        print(f"  {status} {path}")
    
    # Try to find and load the model
    model_path = None
    for path in model_paths:
        if os.path.exists(path):
            model_path = path
            break
    
    if model_path is None:
        print("\n❌ No model file found!")
        return False
    
    print(f"\n📁 Found model at: {model_path}")
    
    try:
        # Try to load the model
        bundle = joblib.load(model_path)
        print("✅ Model file loaded successfully")
        
        if isinstance(bundle, dict):
            print("📦 Model bundle format detected")
            model = bundle.get("model")
            threshold = bundle.get("threshold", 0.5)
            features = bundle.get("features", [])
            
            print(f"  - Model type: {type(model).__name__}")
            print(f"  - Threshold: {threshold}")
            print(f"  - Features: {len(features)} features")
            print(f"  - Feature names: {features}")
            
            # Test if model has predict_proba method
            if hasattr(model, 'predict_proba'):
                print("✅ Model has predict_proba method")
            else:
                print("❌ Model missing predict_proba method")
                return False
                
        else:
            print("📦 Legacy model format detected")
            if hasattr(bundle, 'predict_proba'):
                print("✅ Model has predict_proba method")
            else:
                print("❌ Model missing predict_proba method")
                return False
        
        print("\n✅ Model loading test passed!")
        return True
        
    except Exception as e:
        print(f"\n❌ Error loading model: {e}")
        return False

def test_dependencies():
    """Test if all required dependencies are available"""
    print("🔍 Testing dependencies...")
    
    required_modules = [
        'fastapi',
        'uvicorn',
        'pandas',
        'numpy',
        'sklearn',
        'joblib',
        'pydantic'
    ]
    
    missing = []
    for module in required_modules:
        try:
            __import__(module)
            print(f"  ✅ {module}")
        except ImportError:
            print(f"  ❌ {module}")
            missing.append(module)
    
    if missing:
        print(f"\n❌ Missing dependencies: {', '.join(missing)}")
        print("Install with: pip install -r requirements.txt")
        return False
    
    print("\n✅ All dependencies available!")
    return True

if __name__ == "__main__":
    print("🚀 Exoplanet Classification API - Pre-flight Check")
    print("=" * 60)
    
    deps_ok = test_dependencies()
    model_ok = test_model_loading()
    
    print("\n" + "=" * 60)
    if deps_ok and model_ok:
        print("✅ All checks passed! API should work correctly.")
        print("Start the API with: python start_api.py")
    else:
        print("❌ Some checks failed. Please fix the issues above.")
        sys.exit(1)
