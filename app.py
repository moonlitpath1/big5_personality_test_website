from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pickle
import numpy as np
import os

app = Flask(__name__, static_folder='frontend', static_url_path='')
CORS(app)

classifier = None
scaler = None
kmeans = None

personality_descriptions = {
    "Average": "Balanced across all traits. You have a well-rounded personality with moderate levels in all dimensions.",
    "Reserved": "More introverted and emotionally stable. You tend to be thoughtful, calm, and prefer quieter environments.",
    "Role Model": "High positive traits, low neuroticism. You are emotionally stable, conscientious, and tend to be a positive influence on others.",
    "Self-Centered": "High extraversion with lower agreeableness. You are outgoing and assertive, but may prioritize your own needs."
}

def load_models():
    global classifier, scaler, kmeans
    try:
        with open('personality_classifier.pkl', 'rb') as f:
            classifier = pickle.load(f)
        with open('personality_scaler.pkl', 'rb') as f:
            scaler = pickle.load(f)
        with open('personality_kmeans.pkl', 'rb') as f:
            kmeans = pickle.load(f)
        print("Models loaded successfully!")
    except FileNotFoundError as e:
        print(f"Warning: Model file not found - {e}")
        print("Please ensure personality_classifier.pkl, personality_scaler.pkl, and personality_kmeans.pkl are in the project directory")

load_models()

@app.route('/')
def index():
    return send_from_directory('frontend', 'index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if not classifier or not scaler or not kmeans:
        return jsonify({
            'error': 'Models not loaded. Please ensure all .pkl files are present.',
            'personality_type': 'Unknown',
            'description': 'Unable to make prediction - models not loaded.'
        }), 500
    
    try:
        data = request.json
        
        extraversion = float(data.get('Extraversion', 0))
        neuroticism = float(data.get('Neuroticism', 0))
        agreeableness = float(data.get('Agreeableness', 0))
        conscientiousness = float(data.get('Conscientiousness', 0))
        openness = float(data.get('Openness', 0))
        
        features = np.array([[extraversion, neuroticism, agreeableness, conscientiousness, openness]])
        
        scaled_features = scaler.transform(features)
        
        prediction = classifier.predict(scaled_features)
        personality_type = prediction[0]
        
        description = personality_descriptions.get(personality_type, "Unknown personality type")
        
        return jsonify({
            'personality_type': personality_type,
            'description': description
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'personality_type': 'Error',
            'description': 'An error occurred during prediction.'
        }), 400

if __name__ == '__main__':
    load_models()
    app.run(host='0.0.0.0', port=5000, debug=True)
