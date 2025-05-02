from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from dotenv import load_dotenv
from flask_migrate import Migrate

load_dotenv()

# Initialize extensions
db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()
mail = Mail()
migrate = Migrate()


def create_app():
    app = Flask(__name__)
    CORS(app)

    # Configuration
    app.config.from_object('app.config.Config')

    # Initialize extensions with app
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    migrate.init_app(app, db)

    # Create tables
    with app.app_context():
        db.create_all()

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.profile import profile_bp
    from app.routes.summarization import summarization_bp
    from app.routes.email import email_bp
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(profile_bp, url_prefix='/api')
    app.register_blueprint(summarization_bp, url_prefix='/api')
    app.register_blueprint(email_bp, url_prefix='/api')

    # JWT error handling
    @jwt.invalid_token_loader
    def invalid_token_callback(reason):
        return jsonify({'message': 'Invalid token: {}'.format(reason)}), 422

    @jwt.unauthorized_loader
    def unauthorized_callback(reason):
        return jsonify({'message': 'Missing or invalid token: {}'.format(reason)}), 401

    return app
