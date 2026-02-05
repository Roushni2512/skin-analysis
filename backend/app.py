from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import load_model, predict_image

app = Flask(__name__)
CORS(app)

model = load_model()

@app.route("/")
def home():
    return jsonify({"message": "Multi-class skin detector running"})

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "Image not provided"}), 400

    file = request.files["image"]

    try:
        pred_class, confidence, top3 = predict_image(model, file)
        return jsonify({
            "prediction": pred_class,
            "confidence": confidence,
            "top3": top3
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
