EmotionAI - Advanced Emotion Detection Web Application
======================================================

Overview
--------
EmotionAI is a powerful web application that leverages Deep Learning to analyze and detect human emotions from textual data. Built with TensorFlow, Flask, and a modern frontend stack, it provides real-time sentiment analysis with high accuracy across six primary emotions: Joy, Sadness, Anger, Fear, Love, and Surprise.

Features
--------
- **Real-time Analysis**: Instant emotion detection from text input.
- **Detailed Analytics**: Interactive charts showing emotion distribution and confidence scores.
- **Dashboard**: a Comprehensive view of recent analyses and statistical trends.
- **Modern UI**: Fully responsive, glassmorphism-inspired design with dark/light mode support.
- **REST API**: Exposes endpoints for programmatic access to the emotion detection model.

Project Structure
-----------------
d:/Coding/Data science/emotion detection/
├── app.py              # Main Flask application
├── requirements.txt    # Project dependencies
├── models/             # Trained TensorFlow models and tokenizers
├── static/             # CSS, JavaScript, and Image assets
│   ├── css/            # Stylesheets (style.css)
│   ├── js/             # Frontend logic (main.js, charts.js, dashboard.js)
│   └── images/         # Icons and assets
├── templates/          # HTML Templates (Jinja2)
│   ├── base.html       # Base layout
│   ├── index.html      # Homepage
│   ├── analyze.html    # Analysis interface
│   ├── dashboard.html  # Analytics dashboard
│   ├── about.html      # Project information
│   └── contact.html    # Contact page

Setup & Installation
--------------------
1. **Prerequisites**:
   - Python 3.8+
   - pip (Python package manager)

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Application**:
   You can run the app using the built-in Flask server or Uvicorn (ASGI).

   **Option 1: Flask (Development)**
   ```bash
   python app.py
   ```
   
   **Option 2: Uvicorn (Production-like)**
   Since this is a Flask app, we use `gunicorn` or serve passing the WSGI app.
   For Windows/Standard usage:
   ```bash
   python app.py
   ```
   (The `app.py` is configured to run on port 5000)

4. **Access the App**:
   Open your browser and navigate to: http://localhost:5000

Usage
-----
1. Go to the **Analyzer** page.
2. Enter text (e.g., "I am so happy today!") in the text box.
3. Click **Analyze Text**.
4. View the predicted emotion, confidence score, and probability distribution.
5. Check the **Dashboard** for aggregated insights.

API Endpoints
-------------
- `POST /predict`: Analyze text and return emotion data.
  - Body: `{"text": "your text here"}`
- `GET /health`: Check system status.

Team
----
- **Sony Verma** - Frontend Architect & Lead Developer

License
-------
This project is licensed under the MIT License.
