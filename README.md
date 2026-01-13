<<<<<<< HEAD

=======
# Medvisor AI

This project is a medical image analysis application using React for the frontend and Flask (Python) for the backend.

## Project Structure

- **frontend/**: React application (Vite, TypeScript, Tailwind CSS).
- **backend/**: Flask application (Python, TensorFlow/Keras).

## Getting Started

### Prerequisites

- Node.js & npm
- Python 3.8+

### Setup

1.  **Backend Setup**
    ```bash
    cd backend
    # Create virtual environment (optional but recommended)
    python -m venv venv
    # Activate venv:
    # Windows: venv\Scripts\activate
    # Mac/Linux: source venv/bin/activate
    
    pip install -r requirements.txt
    ```

2.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    ```

## Running the Application

You need to run both the backend and frontend servers.

1.  **Start Backend**
    ```bash
    cd backend
    python app.py
    ```
    The backend will run on `http://localhost:5000`.

2.  **Start Frontend**
    ```bash
    cd frontend
    npm run dev
    ```
    The frontend will run on `http://localhost:8080` (or similar).

## Usage

1.  Open the frontend URL in your browser.
2.  Upload a medical image (e.g., Chest X-ray).
3.  Click "Analyze Image" to see the diagnosis and Grad-CAM visualization.
>>>>>>> 70b57b30 (Refactor: Restructured project into frontend and backend folders)
