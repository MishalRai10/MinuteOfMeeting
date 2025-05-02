import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()  # Load environment variables from .env file


class Config:
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///users.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=3)  # Add this line
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"
    JWT_COOKIE_CSRF_PROTECT = False
    JWT_CSRF_CHECK_FORM_DATA = False
    JWT_CSRF_IN_COOKIES = False
    JWT_CSRF_METHODS = []

    # OpenAI
    AZURE_OPENAI_API_KEY = os.getenv('AZURE_OPENAI_API_KEY')
    AZURE_OPENAI_ENDPOINT = os.getenv('AZURE_OPENAI_ENDPOINT')
    OPENAI_API_VERSION = os.getenv('OPENAI_API_VERSION', '2023-05-15')
    MAILTRAP_API_KEY = os.getenv('MAILTRAP_API_KEY')