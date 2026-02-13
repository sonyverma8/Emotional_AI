from flask import Flask, request, jsonify, render_template
import numpy as np
import sys
import os
import pickle
import warnings
from datetime import datetime

# Suppress TensorFlow warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
warnings.filterwarnings('ignore')

# Try importing TensorFlow with error handling
try:
    import tensorflow as tf
    from tensorflow.keras.preprocessing.sequence import pad_sequences
    print(f"✅ TensorFlow {tf.__version__} loaded successfully")
except ImportError as e:
    print(f"❌ TensorFlow import error: {e}")
    print("Please install TensorFlow: pip install tensorflow==2.12.0")
    sys.exit(1)
except Exception as e:
    print(f"❌ Unexpected error: {e}")
    sys.exit(1)

app = Flask(__name__)

# Global variables
model = None
tokenizer = None
label_encoder = None
max_length = None
class_names = None

def load_models():
    """Load all saved models and components"""
    global model, tokenizer, label_encoder, max_length, class_names
    
    try:
        print("\n" + "="*50)
        print("📦 Loading Emotion Detection Models...")
        print("="*50)
        
        # Check if models directory exists
        if not os.path.exists("models"):
            print("❌ Models directory not found!")
            print("   Please run train_model.py first to train and save the model.")
            return False
        
        # Load TensorFlow model
        model_path = "models/emotion_model.h5"
        if os.path.exists(model_path):
            print(f"📊 Loading model from {model_path}...")
            model = tf.keras.models.load_model(model_path)
            print("✅ Model loaded successfully")
        else:
            print(f"❌ Model not found at {model_path}")
            return False
        
        # Load tokenizer
        tokenizer_path = "models/tokenizer.pkl"
        if os.path.exists(tokenizer_path):
            with open(tokenizer_path, "rb") as f:
                tokenizer = pickle.load(f)
            print("✅ Tokenizer loaded successfully")
        else:
            print(f"❌ Tokenizer not found at {tokenizer_path}")
            return False
        
        # Load label encoder
        encoder_path = "models/label_encoder.pkl"
        if os.path.exists(encoder_path):
            with open(encoder_path, "rb") as f:
                label_encoder = pickle.load(f)
            print("✅ Label encoder loaded successfully")
        else:
            print(f"❌ Label encoder not found at {encoder_path}")
            return False
        
        # Load max length
        max_length_path = "models/max_length.pkl"
        if os.path.exists(max_length_path):
            with open(max_length_path, "rb") as f:
                max_length = pickle.load(f)
            print(f"✅ Max length loaded: {max_length}")
        else:
            print(f"❌ Max length not found at {max_length_path}")
            return False
        
        # Load class names
        class_names_path = "models/class_names.pkl"
        if os.path.exists(class_names_path):
            with open(class_names_path, "rb") as f:
                class_names = pickle.load(f)
            print(f"✅ Class names loaded: {list(class_names)}")
        else:
            print("⚠️ Class names file not found, using label encoder classes")
            class_names = label_encoder.classes_
            print(f"✅ Using class names from label encoder: {list(class_names)}")
        
        print("="*50)
        print("✅ All models loaded successfully!")
        print("="*50)
        return True
        
    except Exception as e:
        print(f"❌ Error loading models: {str(e)}")
        return False

def predict_emotion(text):
    """Predict emotion from input text"""
    try:
        # Preprocess the input text
        sequence = tokenizer.texts_to_sequences([text])
        padded_sequence = pad_sequences(sequence, maxlen=max_length, padding="post")
        
        # Make prediction
        prediction = model.predict(padded_sequence, verbose=0)
        
        # Get the predicted emotion
        predicted_index = np.argmax(prediction[0])
        predicted_emotion = label_encoder.inverse_transform([predicted_index])[0]
        confidence = float(prediction[0][predicted_index])
        
        # Get all emotions with probabilities
        emotion_probs = {}
        for i, emotion in enumerate(class_names):
            emotion_probs[emotion] = float(prediction[0][i])
        
        # Sort probabilities in descending order
        emotion_probs = dict(sorted(emotion_probs.items(), 
                                   key=lambda x: x[1], 
                                   reverse=True))
        
        return {
            'success': True,
            'text': text,
            'predicted_emotion': predicted_emotion,
            'confidence': confidence,
            'confidence_percentage': f"{confidence*100:.2f}%",
            'all_emotions': emotion_probs
        }
    
    except Exception as e:
        return {
            'success': False,
            'text': text,
            'error': str(e)
        }

# Load models on startup
models_loaded = load_models()

# Emotion color mapping
emotion_colors = {
    'joy': '#FFD700',
    'sadness': '#4169E1',
    'anger': '#DC143C',
    'fear': '#800080',
    'love': '#FF69B4',
    'surprise': '#FFA500'
}

def get_color(emotion_name):
    """Get color for emotion"""
    return emotion_colors.get(emotion_name.lower(), '#6366f1')

def get_current_time():
    """Get current time formatted"""
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')

# Add functions to Jinja2 environment
app.jinja_env.globals.update(get_color=get_color, get_current_time=get_current_time)

@app.route('/')
def home():
    """Render home page"""
    if not models_loaded:
        return render_template('index.html', 
                             error="Models not loaded. Please train the model first.")
    return render_template('index.html')

@app.route('/analyze', methods=['GET', 'POST'])
def analyze():
    """Web interface for emotion analysis"""
    if not models_loaded:
        return render_template('analyze.html', 
                             error="Models not loaded. Please train the model first.")
    
    if request.method == 'POST':
        text = request.form.get('text', '').strip()
        if text:
            result = predict_emotion(text)
            if result['success']:
                return render_template('analyze.html',
                                     text=result['text'],
                                     emotion=result['predicted_emotion'],
                                     confidence=result['confidence_percentage'],
                                     emotions=result['all_emotions'])
            else:
                return render_template('analyze.html',
                                     error=result.get('error', 'Prediction failed'))
        else:
            return render_template('analyze.html', error="Please enter some text")
    
    return render_template('analyze.html')

@app.route('/dashboard')
def dashboard():
    """Render dashboard page"""
    if not models_loaded:
        return render_template('dashboard.html', 
                             error="Models not loaded. Please train the model first.")
    
    # Mock data for dashboard if no database is connected yet
    # In a real app, this would come from a database of past predictions
    stats = {
        'total_predictions': 1250,
        'accuracy': 87.5,
        'most_common_emotion': 'joy',
        'recent_activity': [
            {'time': '10 mins ago', 'emotion': 'joy', 'confidence': '92%'},
            {'time': '25 mins ago', 'emotion': 'surprise', 'confidence': '85%'},
            {'time': '1 hour ago', 'emotion': 'sadness', 'confidence': '78%'},
            {'time': '2 hours ago', 'emotion': 'anger', 'confidence': '88%'},
            {'time': '3 hours ago', 'emotion': 'joy', 'confidence': '95%'}
        ],
        'emotion_distribution': {
            'joy': 35,
            'sadness': 20,
            'anger': 15,
            'fear': 10,
            'love': 12,
            'surprise': 8
        }
    }
    
    return render_template('dashboard.html', stats=stats)

@app.route('/about')
def about():
    """Render about page"""
    return render_template('about.html')

@app.route('/contact')
def contact():
    """Render contact page"""
    return render_template('contact.html')

@app.route('/predict', methods=['POST'])
def predict():
    """API endpoint for emotion prediction"""
    if not models_loaded:
        return jsonify({
            'error': 'Models not loaded. Please train the model first.',
            'status': 'error'
        }), 503
    
    try:
        # Get JSON data
        if request.is_json:
            data = request.get_json()
            text = data.get('text', '').strip()
        else:
            text = request.form.get('text', '').strip()
        
        if not text:
            return jsonify({
                'error': 'No text provided',
                'status': 'error'
            }), 400
        
        # Make prediction
        result = predict_emotion(text)
        
        if result['success']:
            response = {
                'text': result['text'],
                'predicted_emotion': result['predicted_emotion'],
                'confidence': result['confidence'],
                'confidence_percentage': result['confidence_percentage'],
                'all_emotions': result['all_emotions'],
                'status': 'success'
            }
            return jsonify(response)
        else:
            return jsonify({
                'error': result.get('error', 'Prediction failed'),
                'status': 'error'
            }), 500
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy' if models_loaded else 'unhealthy',
        'models_loaded': models_loaded,
        'tensorflow_version': tf.__version__,
        'python_version': sys.version
    })

@app.route('/emotions', methods=['GET'])
def get_emotions():
    """Get list of available emotions"""
    if not models_loaded:
        return jsonify({
            'error': 'Models not loaded',
            'status': 'error'
        }), 503
    
    return jsonify({
        'emotions': class_names.tolist() if class_names is not None else [],
        'count': len(class_names) if class_names is not None else 0,
        'status': 'success'
    })

if __name__ == '__main__':
    print("\n🚀 Starting Emotion Detection Flask App...")
    print(f"📍 http://localhost:5000")
    print("📍 http://127.0.0.1:5000")
    print("\n📝 Press Ctrl+C to stop the server\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)