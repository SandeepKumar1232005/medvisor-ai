from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from .extensions import db
from config import Config
import os

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    CORS(app)
    db.init_app(app)
    Bcrypt(app)
    JWTManager(app)

    # Ensure directories exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['GRADCAM_FOLDER'], exist_ok=True)

    # Register blueprints
    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint, url_prefix='/api/auth')

    from .main import main as main_blueprint
    # Initialize model within app context (mostly for logging purposes if needed, 
    # but the global init in main.py handles the loading)
    from .main import init_model
    init_model(app)
    
    app.register_blueprint(main_blueprint)

    # Create Database Tables
    with app.app_context():
        db.create_all()

    return app
