import tensorflow as tf
from tensorflow import keras
import numpy as np
from PIL import Image
import io
import json
import os

IMG_SIZE = (224, 224)

# Load class names
class_names_path = os.path.join("model", "class_names.json")
with open(class_names_path, "r") as f:
    CLASS_NAMES = json.load(f)

def load_model():
    model_path = os.path.join("model", "skin_model.h5")
    model = keras.models.load_model(model_path)
    return model

def preprocess_image(file):
    if hasattr(file, "read"):
        img_bytes = file.read()
    else:
        img_bytes = file

    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    img = img.resize(IMG_SIZE)
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

def predict_image(model, file):
    img_array = preprocess_image(file)
    preds = model.predict(img_array)
    probs = tf.nn.softmax(preds[0]).numpy()

    top_index = int(np.argmax(probs))
    predicted_class = CLASS_NAMES[top_index]
    confidence = float(probs[top_index])

    top3_indices = probs.argsort()[-3:][::-1]
    top3 = [
        {"class": CLASS_NAMES[i], "confidence": float(probs[i])}
        for i in top3_indices
    ]

    return predicted_class, confidence, top3
