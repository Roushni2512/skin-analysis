
import tensorflow as tf

model = tf.keras.models.load_model("mobilenet_skin_demo.h5")

converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

with open("backend/model/model.tflite", "wb") as f:
    f.write(tflite_model)

print("model.tflite saved!")
