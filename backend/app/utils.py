import numpy as np
import tensorflow as tf
import cv2
import os

def generate_gradcam(model, img_array, last_conv_layer_name):
    """
    Generate Grad-CAM heatmap for an input image.
    """
    try:
        # Get the model's prediction
        preds = model.predict(img_array)
        pred_index = np.argmax(preds[0])

        # Create a model that maps the input image to the activations
        # of the last conv layer and the final predictions
        # Check if layer exists
        try:
            model.get_layer(last_conv_layer_name)
        except ValueError:
            # Fallback for MobileNetV2 if layer name is incorrect or different
            if "mobilenetv2" in model.name.lower():
                last_conv_layer_name = "Conv_1"
            else:
                 return None

        grad_model = tf.keras.models.Model(
            [model.inputs],
            [model.get_layer(last_conv_layer_name).output, model.output]
        )

        with tf.GradientTape() as tape:
            conv_outputs, predictions = grad_model(img_array)
            loss = predictions[:, pred_index]

        grads = tape.gradient(loss, conv_outputs)
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2)).numpy()
        conv_outputs = conv_outputs[0].numpy()

        for i in range(len(pooled_grads)):
            conv_outputs[:, :, i] *= pooled_grads[i]

        heatmap = np.mean(conv_outputs, axis=-1)
        heatmap = np.maximum(heatmap, 0)
        heatmap /= np.max(heatmap) + 1e-10

        return heatmap
    except Exception as e:
        print(f"Error in GradCAM: {e}")
        return None

def overlay_heatmap(heatmap, original_image, intensity=0.5):
    """
    Overlay heatmap on original image.
    """
    if heatmap is None:
        return original_image

    heatmap = cv2.resize(heatmap, (original_image.shape[1], original_image.shape[0]))
    heatmap = np.uint8(255 * heatmap)
    heatmap_color = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    output = cv2.addWeighted(heatmap_color, intensity, original_image, 1 - intensity, 0)
    return output

def load_model_safe(model_path):
    """
    Load model from path or fallback to MobileNetV2.
    """
    try:
        if os.path.exists(model_path):
            print(f"Loading custom model from {model_path}")
            model = tf.keras.models.load_model(model_path)
            # You might need to adjust this depending on your custom model's architecture
            last_conv_layer_name = "conv5_block3_out" 
        else:
            print("Custom model not found. Loading MobileNetV2 (ImageNet)...")
            model = tf.keras.applications.MobileNetV2(weights="imagenet")
            last_conv_layer_name = "Conv_1"
        return model, last_conv_layer_name
    except Exception as e:
        print(f"Error loading model: {e}")
        return None, None
