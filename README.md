# AI Skin Detector

A full-stack application for detecting skin in images using AI/ML.

## Project Structure

- `backend/`: Flask API with TensorFlow model for skin detection
- `frontend/`: React application for uploading images and displaying results
- `db/`: Database initialization scripts
- `docker-compose.yml`: Docker Compose configuration for easy deployment

## Setup

1. Ensure Docker and Docker Compose are installed.

2. Clone or navigate to the project directory.

3. Run the application:
   ```bash
   docker-compose up --build
   ```

4. Open your browser and go to `http://localhost:3000` for the frontend.

5. The backend API will be available at `http://localhost:5000`.

## Usage

1. Upload an image using the frontend interface.
2. The AI model will analyze the image and determine if it contains skin.
3. View the results including confidence score.

## Development

### Backend
- Navigate to `backend/` directory
- Install dependencies: `pip install -r requirements.txt`
- Run the app: `python app.py`

### Frontend
- Navigate to `frontend/` directory
- Install dependencies: `npm install`
- Run the app: `npm run dev`

## Model

The skin detection model is based on MobileNetV2 and can be created using `backend/model/create_demo_model.py`.

## Database

Uses SQLite for storing detection results. Schema defined in `db/init.sql`.
