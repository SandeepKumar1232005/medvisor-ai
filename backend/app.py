from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import cv2
import os
import uuid
from scripts.gradcam import generate_gradcam, overlay_heatmap

app = Flask(__name__, static_folder='static')
CORS(app)  # Enable CORS for all routes

# Ensure static directories exist
os.makedirs(os.path.join(app.static_folder, 'gradcam'), exist_ok=True)
os.makedirs(os.path.join(app.static_folder, 'uploads'), exist_ok=True)

MODEL_PATH = "models/model.h5"

# Load trained model or fallback to MobileNetV2
try:
    if os.path.exists(MODEL_PATH):
        print(f"Loading custom model from {MODEL_PATH}")
        model = tf.keras.models.load_model(MODEL_PATH)
        last_conv_layer_name = "conv5_block3_out"  # Example for ResNet50, adjust for custom model
    else:
        print("Custom model not found. Loading MobileNetV2 (ImageNet)...")
        model = tf.keras.applications.MobileNetV2(weights="imagenet")
        last_conv_layer_name = "Conv_1" # Last conv layer of MobileNetV2
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.route("/")
def home():
    return {"status": "Backend Running"}

@app.route("/static/gradcam/<path:filename>")
def serve_gradcam(filename):
    return send_from_directory(os.path.join(app.static_folder, 'gradcam'), filename)

@app.route("/predict", methods=["POST"])
def predict():
    if not model:
        return {"error": "Model not loaded"}, 500

    if "image" not in request.files:
        return {"error": "No image uploaded"}, 400

    try:
        img_file = request.files["image"]
        
        # Save original file temporarily for debugging/logging (optional)
        filename = str(uuid.uuid4())
        upload_path = os.path.join(app.static_folder, 'uploads', f"{filename}.jpg")
        
        # Read image
        img_bytes = img_file.read()
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
             return {"error": "Invalid image format"}, 400

        # Save uploaded image
        cv2.imwrite(upload_path, img)

        # Preprocess for model
        img_resized = cv2.resize(img, (224, 224))
        
        # MobileNetV2 expects inputs in [-1, 1]
        img_preprocessed = tf.keras.applications.mobilenet_v2.preprocess_input(img_resized.astype(np.float32))
        img_expanded = np.expand_dims(img_preprocessed, axis=0)

        # Predict
        prediction = model.predict(img_expanded)[0]
        
        # Get top prediction for ImageNet (MobileNetV2)
        decoded_preds = tf.keras.applications.mobilenet_v2.decode_predictions(np.array([prediction]), top=3)[0]
        top_pred = decoded_preds[0] # (class_id, class_name, score)
        
        class_name = top_pred[1]
        confidence = float(top_pred[2]) * 100

        # Create simulated "Severity" based on confidence for demo purposes
        severity = "normal"
        if confidence > 80: severity = "severe"
        elif confidence > 50: severity = "moderate"
        elif confidence > 20: severity = "mild"
        
        if "normal" in class_name.lower() or "monitor" in class_name.lower(): # Just a heuristic for demo
            severity = "normal"

        # Generate GradCAM
        try:
            heatmap = generate_gradcam(model, img_expanded, last_conv_layer_name)
            
            # Overlay heatmap on original resized image
            overlay_img = overlay_heatmap(heatmap, img_resized)
            
            gradcam_filename = f"gradcam_{filename}.jpg"
            gradcam_path = os.path.join(app.static_folder, 'gradcam', gradcam_filename)
            cv2.imwrite(gradcam_path, overlay_img)
            
            gradcam_url = f"http://localhost:5000/static/gradcam/{gradcam_filename}"
        except Exception as e:
            print(f"GradCAM generation failed: {e}")
            gradcam_url = None

        # Format differential diagnoses
        differential = []
        for pred in decoded_preds:
            differential.append({
                "condition": pred[1].replace('_', ' ').title(),
                "confidence": float(pred[2]) * 100,
                "severity": "unknown" # Placeholder
            })

        return jsonify({
            "predicted_class": class_name.replace('_', ' ').title(),
            "confidence": confidence,
            "severity": severity,
            "gradcam_image": gradcam_url,
            "differential": differential
        })

    except Exception as e:
        print(f"Prediction Error: {e}")
        return {"error": str(e)}, 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)