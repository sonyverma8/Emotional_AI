import subprocess
import sys
import os

def setup_environment():
    """Setup the environment for Emotion Detection App"""
    
    print("="*50)
    print("🔧 Setting up Emotion Detection Environment")
    print("="*50)
    
    # Check Python version
    python_version = sys.version_info
    print(f"📌 Python version: {python_version.major}.{python_version.minor}.{python_version.micro}")
    
    if python_version.major < 3 or (python_version.major == 3 and python_version.minor < 8):
        print("❌ Python 3.8 or higher is required")
        sys.exit(1)
    
    # Install packages
    packages = [
        "tensorflow==2.12.0",
        "pandas==1.5.3",
        "numpy==1.23.5",
        "scikit-learn==1.2.2",
        "flask==2.2.5",
        "joblib==1.2.0"
    ]
    
    print("\n📦 Installing required packages...")
    for package in packages:
        print(f"   Installing {package}...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
    
    print("\n✅ All packages installed successfully!")
    
    # Check if train.txt exists
    if not os.path.exists("dataset/train.txt"):
        print("\n⚠️  Warning: dataset/train.txt not found!")
        print("   Please place your training data in dataset/train.txt")
    
    print("\n" + "="*50)
    print("✅ Setup complete!")
    print("📝 Next steps:")
    print("   1. Train the model: python train_model.py")
    print("   2. Run the app: python app.py")
    print("="*50)

if __name__ == "__main__":
    setup_environment()