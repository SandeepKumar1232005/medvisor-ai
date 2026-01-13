import numpy as np
import tensorflow as tf
import cv2

def generate_gradcam(model, img_array, last_conv_layer_name):
    """
    Generate Grad-CAM heatmap for an input image.

    Args:
        model: Loaded Keras model
        img_array: Preprocessed image array (shape: (1, H, W, 3))
        last_conv_layer_name: Name of the last conv layer in the model

    Returns:
        heatmap: Grad-CAM heatmap as numpy array
    """

    # Get the model's prediction
    preds = model.predict(img_array)
    pred_index = np.argmax(preds[0])

    # Create a model that maps the input image to the activations
    # of the last conv layer and the final predictions
    grad_model = tf.keras.models.Model(
        [model.inputs],
        [model.get_layer(last_conv_layer_name).output, model.output]
    )

    # Compute the gradient of the predicted class with respect
    # to the output feature map
    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(img_array)
        loss = predictions[:, pred_index]

    grads = tape.gradient(loss, conv_outputs)

    # Take mean of gradients over each channel
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2)).numpy()

    conv_outputs = conv_outputs[0].numpy()

    # Multiply conv feature maps by importance weights
    for i in range(len(pooled_grads)):
        conv_outputs[:, :, i] *= pooled_grads[i]

    # Generate heatmap
    heatmap = np.mean(conv_outputs, axis=-1)

    # Normalize heatmap
    heatmap = np.maximum(heatmap, 0)
    heatmap /= np.max(heatmap) + 1e-10

    return heatmap


def overlay_heatmap(heatmap, original_image, intensity=0.5):
    """
    Overlay heatmap on original image.

    Args:
        heatmap: Grad-CAM heatmap
        original_image: Original image (BGR format)
        intensity: heatmap intensity

    Returns:
        output: image with heatmap overlay
    """

    heatmap = cv2.resize(heatmap, (original_image.shape[1], original_image.shape[0]))
    heatmap = np.uint8(255 * heatmap)
    heatmap_color = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    output = cv2.addWeighted(heatmap_color, intensity, original_image, 1 - intensity, 0)

    return output
