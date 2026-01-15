from flask import Blueprint, request, jsonify, current_app, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
import uuid
import cv2
import numpy as np
import tensorflow as tf
from werkzeug.utils import secure_filename
from .models import Prediction
from .extensions import db
from .utils import generate_gradcam, overlay_heatmap, load_model_safe

main = Blueprint('main', __name__)

# Global variables for model
model = None
last_conv_layer_name = None

def init_model(app):
    global model, last_conv_layer_name
    model, last_conv_layer_name = load_model_safe(app.config['MODEL_PATH'])

@main.route("/")
def home():
    return {"status": "Backend Running", "api_version": "v2"}

@main.route("/static/gradcam/<path:filename>")
def serve_gradcam(filename):
    return send_from_directory(current_app.config['GRADCAM_FOLDER'], filename)

@main.route("/static/uploads/<path:filename>")
def serve_uploads(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)

@main.route("/api/predict", methods=["POST"])
@jwt_required(optional=True) 
def predict():
    global model, last_conv_layer_name
    if not model:
        return {"error": "Model not loaded"}, 500

    if "image" not in request.files:
        return {"error": "No image uploaded"}, 400

    try:
        img_file = request.files["image"]
        
        # Save original file
        filename = str(uuid.uuid4()) + ".jpg" # Ensure jpg extension
        upload_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        
        # Read image
        img_bytes = img_file.read()
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
             return {"error": "Invalid image format"}, 400

        cv2.imwrite(upload_path, img)

        # Preprocess for model (MobileNetV2 standard)
        img_resized = cv2.resize(img, (224, 224))
        img_preprocessed = tf.keras.applications.mobilenet_v2.preprocess_input(img_resized.astype(np.float32))
        img_expanded = np.expand_dims(img_preprocessed, axis=0)

        # Predict
        prediction = model.predict(img_expanded)[0]
        
        # Get top prediction for ImageNet
        decoded_preds = tf.keras.applications.mobilenet_v2.decode_predictions(np.array([prediction]), top=3)[0]
        top_pred = decoded_preds[0] # (class_id, class_name, score)
        
        class_name = top_pred[1]
        confidence = float(top_pred[2]) * 100

        # Severity Logic
        severity = "normal"
        if confidence > 80: severity = "severe"
        elif confidence > 50: severity = "moderate"
        elif confidence > 20: severity = "mild"
        
        if "normal" in class_name.lower() or "monitor" in class_name.lower():
            severity = "normal"

        # Generate GradCAM
        gradcam_url = None
        gradcam_filename = None
        try:
            heatmap = generate_gradcam(model, img_expanded, last_conv_layer_name)
            if heatmap is not None:
                overlay_img = overlay_heatmap(heatmap, img_resized)
                gradcam_filename = f"gradcam_{filename}"
                gradcam_path = os.path.join(current_app.config['GRADCAM_FOLDER'], gradcam_filename)
                cv2.imwrite(gradcam_path, overlay_img)
                # Construct URL
                gradcam_url = f"{request.host_url}static/gradcam/{gradcam_filename}"
        except Exception as e:
            print(f"GradCAM generation failed: {e}")

        # Save to DB
        current_user_id = get_jwt_identity()
        new_prediction = Prediction(
            image_path=filename,
            predicted_class=class_name.replace('_', ' ').title(),
            confidence=confidence,
            severity=severity,
            gradcam_path=gradcam_filename,
            user_id=current_user_id
        )
        db.session.add(new_prediction)
        db.session.commit()

        # Format differential diagnoses
        differential = []
        for pred in decoded_preds:
            differential.append({
                "condition": pred[1].replace('_', ' ').title(),
                "confidence": float(pred[2]) * 100,
                "severity": "unknown"
            })

        return jsonify({
            "id": new_prediction.id,
            "predicted_class": new_prediction.predicted_class,
            "confidence": new_prediction.confidence,
            "severity": new_prediction.severity,
            "gradcam_image": gradcam_url,
            "differential": differential
        })

    except Exception as e:
        print(f"Prediction Error: {e}")
        return {"error": str(e)}, 500

@main.route("/api/history", methods=["GET"])
@jwt_required()
def history():
    current_user_id = get_jwt_identity()
    predictions = Prediction.query.filter_by(user_id=current_user_id).order_by(Prediction.date_posted.desc()).all()
    
    results = []
    for pred in predictions:
        gradcam_url = None
        if pred.gradcam_path:
             gradcam_url = f"{request.host_url}static/gradcam/{pred.gradcam_path}"
             
        results.append({
            "id": pred.id,
            "predicted_class": pred.predicted_class,
            "confidence": pred.confidence,
            "severity": pred.severity,
            "date": pred.date_posted.isoformat(),
            "gradcam_image": gradcam_url,
            "image_url": f"{request.host_url}static/uploads/{pred.image_path}"
        })
    
    return jsonify(results)
