#!/usr/bin/env python3
"""
Startup script for the Exoplanet Classification API
"""

import os
import sys
import subprocess
import argparse

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import fastapi
        import uvicorn
        import pandas
        import numpy
        import sklearn
        import joblib
        print("✅ All dependencies are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please install dependencies with: pip install -r requirements.txt")
        return False

def find_model():
    """Find the model file"""
    model_paths = [
        "models/best_koi_reduced_rf.joblib",
        "../exo_classification/models/best_koi_reduced_rf.joblib",
        "exo_classification/models/best_koi_reduced_rf.joblib",
        "test_classification/models/best_koi_reduced_rf.joblib"
    ]
    
    for path in model_paths:
        if os.path.exists(path):
            print(f"✅ Found model at: {path}")
            return path
    
    print("❌ Model file not found in any expected location:")
    for path in model_paths:
        print(f"  - {path}")
    return None

def start_api(host="0.0.0.0", port=8000, reload=True):
    """Start the FastAPI server"""
    if not check_dependencies():
        return False
    
    if not find_model():
        print("⚠️  Starting API without model (predictions will fail)")
    
    print(f"🚀 Starting Exoplanet Classification API on {host}:{port}")
    print(f"📚 Interactive docs: http://{host}:{port}/docs")
    print(f"🔍 Health check: http://{host}:{port}/health")
    print("Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        # Change to the api directory to run uvicorn
        api_dir = os.path.dirname(os.path.abspath(__file__))
        original_cwd = os.getcwd()
        os.chdir(api_dir)
        
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "main:app", 
            "--host", host, 
            "--port", str(port),
            "--reload" if reload else "--no-reload"
        ])
        
        # Restore original working directory
        os.chdir(original_cwd)
    except KeyboardInterrupt:
        print("\n👋 API server stopped")
        os.chdir(original_cwd)
    except Exception as e:
        print(f"❌ Error starting API: {e}")
        os.chdir(original_cwd)
        return False
    
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Start the Exoplanet Classification API")
    parser.add_argument("--host", default="0.0.0.0", help="Host to bind to")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind to")
    parser.add_argument("--no-reload", action="store_true", help="Disable auto-reload")
    
    args = parser.parse_args()
    
    start_api(
        host=args.host,
        port=args.port,
        reload=not args.no_reload
    )
