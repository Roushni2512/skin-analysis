# TODO: Fix Errors in Skin Detector Project

- [x] Add TensorFlow to backend/requirements.txt
- [x] Fix imports in backend/model/create_demo_model.py (add tf.keras imports)
- [x] Fix imports in backend/model/convert_to_tflite.py (add tf imports)
- [x] Update DB config in backend/utils.py to match docker-compose.yml (host=db, user=aiuser, password=aipass, database=ai_app)
- [x] Fix db/init.sql to create 'predictions' table with columns: id (AUTO_INCREMENT), timestamp (DEFAULT CURRENT_TIMESTAMP), filename, result, confidence
- [x] Change backend route in backend/app.py from '/predict' to '/detect'
- [x] Update frontend/src/App.jsx to display classification result instead of binary skin detection
- [x] Run backend/model/create_demo_model.py to create model
- [x] Run backend/model/convert_to_tflite.py to convert to TFLite
- [x] Fix frontend/Dockerfile to use Node.js instead of Python
- [x] Create frontend/requirements.txt (though not needed for Node)
