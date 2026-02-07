
import numpy as np
import tensorflow as tf
from tensorflow.keras import models, layers

NUM_CLASSES = 5
INPUT_SHAPE = (224,224,3)

base = tf.keras.applications.MobileNetV2(input_shape=INPUT_SHAPE, include_top=False, weights=None)
model = models.Sequential([
    base,
    layers.GlobalAveragePooling2D(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.3),
    layers.Dense(NUM_CLASSES, activation='softmax')
])

# Random small dataset for demo only
X = np.random.rand(200,224,224,3).astype('float32')
y = tf.keras.utils.to_categorical(np.random.randint(0, NUM_CLASSES, size=(200,)), NUM_CLASSES)

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.fit(X, y, epochs=3, batch_size=16)
model.save('backend/model/skin_model.h5')
print('Saved skin_model.h5')
